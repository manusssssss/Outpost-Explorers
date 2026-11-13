# Online crew relay setup

The trainer uses a Cloudflare Worker with a SQLite-backed Durable Object to relay two-player mission state, actions, chat, and WebRTC voice signaling. The Worker is already deployed for the Outpost Explorers site.

The browser URL is configured in `room-config.js` as `websocketUrl`. If the Worker is redeployed at a different address, update that value and publish the trainer site again. The Worker accepts requests from `https://manusssssss.github.io` and supports two players per invite room.

## Deploy or update the Worker

From this folder, open a terminal in `realtime-room-worker` and run:

```powershell
npx.cmd wrangler login --device --scopes account:read user:read workers:write workers_scripts:write
npx.cmd wrangler deploy
```

Wrangler prints the `workers.dev` URL after deployment. Keep the URL in `trainer/room-config.js` in sync with it. Never commit Cloudflare API tokens or account secrets.

## Limits

- Invite URLs contain a random room code; share each invite only with the intended player.
- Mission state, positions/actions, and text chat use the relay.
- Voice audio uses browser WebRTC and public STUN; restrictive networks may still block voice even when game state works.
- This is an educational two-player prototype, not a production-secure lobby or anti-cheat system.
