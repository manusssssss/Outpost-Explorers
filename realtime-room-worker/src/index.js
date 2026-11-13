import { DurableObject } from "cloudflare:workers";

const ROOM_ID = /^[a-f0-9-]{16,64}$/i;
const allowedOrigin = (request, env) => {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGIN || "https://manusssssss.github.io").split(",").map(value => value.trim());
  return allowed.includes(origin) ? origin : "";
};

export class Room extends DurableObject {
  async fetch(request) {
    const url = new URL(request.url);
    const role = url.searchParams.get("role");
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return new Response("WebSocket upgrade required", { status: 426 });
    if (role !== "host" && role !== "guest") return new Response("Invalid player role", { status: 400 });
    const sessions = this.ctx.getWebSockets();
    if (sessions.length >= 2) return new Response("This invite already has two players", { status: 409 });
    if (sessions.some(socket => socket.deserializeAttachment()?.role === role)) return new Response("That player slot is already in use", { status: 409 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ role, joinedAt: Date.now() });
    for (const peer of sessions) {
      if (peer.readyState === WebSocket.OPEN) peer.send(JSON.stringify({ type: "peer-joined", role }));
    }
    server.send(JSON.stringify({ type: "room-state", peerPresent: sessions.length > 0, peerRole: sessions[0]?.deserializeAttachment()?.role || "" }));
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(socket, message) {
    if (typeof message !== "string" || message.length > 16000) {
      socket.close(1009, "Message too large");
      return;
    }
    let parsed;
    try { parsed = JSON.parse(message); } catch { return; }
    if (!parsed || typeof parsed !== "object" || typeof parsed.type !== "string") return;
    const payload = JSON.stringify(parsed);
    if (payload.length > 16000) return;
    for (const peer of this.ctx.getWebSockets()) {
      if (peer !== socket && peer.readyState === WebSocket.OPEN) peer.send(payload);
    }
  }

  webSocketClose(socket, code, reason) {
    const role = socket.deserializeAttachment()?.role;
    for (const peer of this.ctx.getWebSockets()) {
      if (peer !== socket && peer.readyState === WebSocket.OPEN) {
        peer.send(JSON.stringify({ type: "peer-left", role }));
      }
    }
    socket.close(code, reason);
  }

  webSocketError(socket) {
    try { socket.close(1011, "Room relay error"); } catch { }
  }
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env);
    if (!origin) return new Response("Origin not allowed", { status: 403 });
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/room\/([a-f0-9-]{16,64})$/i);
    if (!match || !ROOM_ID.test(match[1])) return new Response("Not found", { status: 404 });
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return new Response("WebSocket upgrade required", { status: 426 });
    const roomId = env.ROOMS.idFromName(match[1]);
    return env.ROOMS.get(roomId).fetch(request);
  }
};

