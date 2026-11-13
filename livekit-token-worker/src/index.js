const corsHeaders = origin => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Vary": "Origin"
});
const json = (body, status, origin) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});
const b64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes)))
  .replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
const encodeJson = value => b64url(new TextEncoder().encode(JSON.stringify(value)));
async function sign(payload, secret) {
  const header = encodeJson({ alg: "HS256", typ: "JWT" });
  const body = encodeJson(payload);
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${b64url(signature)}`;
}
export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = env.LIVEKIT_ALLOWED_ORIGIN || "https://manusssssss.github.io";
    if (requestOrigin !== allowedOrigin) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    if (request.method !== "POST" || new URL(request.url).pathname !== "/token") return json({ error: "Not found" }, 404, allowedOrigin);
    if (!env.LIVEKIT_API_KEY || !env.LIVEKIT_API_SECRET) return json({ error: "LiveKit token service is missing its server credentials." }, 503, allowedOrigin);
    try {
      const body = await request.json();
      const room = String(body.room || "");
      const role = body.role === "host" ? "host" : body.role === "guest" ? "guest" : "";
      if (!/^[a-f0-9-]{16,64}$/i.test(room) || !role) return json({ error: "A valid invite room and role are required." }, 400, allowedOrigin);
      const now = Math.floor(Date.now() / 1000);
      const identity = `${role}-${crypto.randomUUID()}`;
      const token = await sign({
        iss: env.LIVEKIT_API_KEY,
        sub: identity,
        name: role === "host" ? "Player 1 · Engineer" : "Player 2 · Scientist",
        nbf: now - 5,
        iat: now,
        exp: now + 600,
        video: {
          room,
          roomJoin: true,
          canPublish: true,
          canPublishData: true,
          canSubscribe: true
        },
        roomConfig: { maxParticipants: 2 }
      }, env.LIVEKIT_API_SECRET);
      return json({ token, identity }, 200, allowedOrigin);
    } catch {
      return json({ error: "Invalid token request." }, 400, allowedOrigin);
    }
  }
};

