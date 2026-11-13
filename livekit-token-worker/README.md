# LiveKit Cloud token service for Outpost Explorers

This Cloudflare Worker issues short-lived, room-scoped LiveKit access tokens. Keep `LIVEKIT_API_SECRET` only as a Worker secret. The GitHub Pages client must never receive it.

## 1. Create a LiveKit Cloud project

Create a project in the [LiveKit Cloud dashboard](https://cloud.livekit.io/), then copy its WebSocket server URL, API key, and API secret. The key and secret are server-only.

## 2. Deploy the token Worker

Install Node.js and Wrangler, then run these commands from this folder:

```powershell
npm install --global wrangler
wrangler login
wrangler secret put LIVEKIT_API_KEY
wrangler secret put LIVEKIT_API_SECRET
wrangler deploy
```

Paste the values when Wrangler prompts. Do not commit those values or put them in a frontend file. The Worker URL ends with `workers.dev`; append `/token` for the endpoint.

To change the allowed website origin, edit `LIVEKIT_ALLOWED_ORIGIN` in `wrangler.toml`. The current value allows the published GitHub Pages origin. CORS is a browser boundary, not user authentication; invite links are bearer links, so only share them with the intended player.

## 3. Point the trainer at LiveKit

Edit `trainer/livekit-config.js` in the website repository:

```js
window.OUTPOST_LIVEKIT_CONFIG = {
  serverUrl: 'wss://YOUR-PROJECT.livekit.cloud',
  tokenUrl: 'https://YOUR-WORKER.workers.dev/token'
};
```

Commit and publish the site update. The worker grants each token access only to the invite's room and expires it after ten minutes. LiveKit handles two-way voice and reliable mission/chat data; rover movement updates use an unreliable channel to keep them responsive.

## Troubleshooting

- `LiveKit is not configured yet`: set both public URLs in `trainer/livekit-config.js`.
- `token service is missing its server credentials`: run the two `wrangler secret put` commands.
- Browser reports CORS: set `LIVEKIT_ALLOWED_ORIGIN` to the exact site origin, without a path, then deploy the Worker again.
- Microphone unavailable: allow microphone access for the HTTPS website in the browser.

