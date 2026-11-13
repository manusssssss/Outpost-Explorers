# Turn on online crew relay

The trainer supports direct PeerJS invites and an optional Supabase Realtime broadcast relay. The relay is the route to try when two players on different networks remain stuck on “Connecting to host.” GitHub Pages cannot run the relay server itself; Supabase provides the WebSocket service.

## Configure the public browser client

1. Create a Supabase project at https://supabase.com/dashboard (the free tier is enough for a small trial).
2. In **Project Settings → API**, copy the **Project URL** and the **publishable key** (or legacy `anon` public key). These values are intended to be visible in a browser app.
3. Edit `trainer/realtime-config.js` and set:

   ```js
   window.OUTPOST_REALTIME_CONFIG = {
     url: 'https://YOUR-PROJECT.supabase.co',
     publishableKey: 'YOUR-PUBLISHABLE-KEY'
   };
   ```

4. Deploy that file with the trainer. Reload both players’ pages. Player 1 chooses **Create invite link**; Player 2 opens the link. Both keep the page open. When connected, either player can ask to start; the host starts both copies of the mission.

Never put a Supabase `secret` or `service_role` key in this file or in GitHub. Do not send one in chat. The client uses public broadcast rooms addressed by a random invitation ID; anyone who obtains the invite URL may join that room, so share it only with the intended partner. The host accepts one remote player.

## Current relay limits

- Text chat and mission/position/action messages use the relay.
- Voice chat is disabled in relay mode; it still needs a separate media service.
- This is an educational two-player prototype, not a production anti-cheat or secure private lobby.
- Without the project URL and public key, the page falls back to direct PeerJS WebRTC. Direct peer connections may fail on restrictive school/work/mobile networks or symmetric NAT; TURN relaying is required for those cases. See https://peerjs.com/client/faq and https://supabase.com/docs/guides/realtime/broadcast.
