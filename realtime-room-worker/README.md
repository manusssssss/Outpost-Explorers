# Outpost Explorers room relay

A small Cloudflare Worker and Durable Object relay for the trainer's two-player sessions. It relays mission state, chat and WebRTC voice-signaling messages; it does not need LiveKit credentials. Voice audio itself uses browser WebRTC with a public STUN server, so voice can still be blocked by restrictive networks. Game state and chat remain relayed by the Worker.

## Deploy

1. Create/sign in to a Cloudflare account and open a terminal in this folder.
2. Run:

```powershell
npx wrangler login
npx wrangler deploy
```

The included SQLite-backed Durable Object binding supports the Cloudflare Workers Free plan. The room server accepts only two players and only the Outpost Explorers GitHub Pages origin by default.

3. Copy the deployed Worker URL, usually `https://outpost-room-relay.<your-account>.workers.dev`.
4. In `trainer/room-config.js`, set:

```js
window.OUTPOST_ROOM_CONFIG = {
  websocketUrl: 'https://outpost-room-relay.<your-account>.workers.dev'
};
```

5. Commit and publish the website. Invite links contain a random room code; only share them with the intended player.

For local testing, add the exact local origin (for example `http://localhost:8080`) to `ALLOWED_ORIGIN` in `wrangler.toml`, separated by a comma, then redeploy.

