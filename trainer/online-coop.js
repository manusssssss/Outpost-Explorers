const $ = selector => document.querySelector(selector);
const panel = $('#online-panel');
const toggle = $('#online-toggle');
const status = $('#online-status');
const mission = $('#online-mission');
const level = $('#online-level');
const inviteBox = $('#online-invite');
const inviteLink = $('#online-link');
const hostButton = $('#online-host');
const startButton = $('#online-start');
const chatLog = $('#chat-log');
const chatInput = $('#chat-input');
const chatSend = $('#chat-send');
const voiceButton = $('#voice-toggle');
const voiceEndButton = $('#voice-end');
const voiceStatus = $('#voice-status');
const remoteAudio = $('#remote-audio');
let peer = null;
let connection = null;
let role = null;
let localStream = null;
let activeCall = null;
let remoteVoiceReady = false;
let peerReady = false;
let joinAttempt = 0;
let lastPeerErrorAt = 0;
let lastConnectionIssue = '';
let lastConnectionIssueAt = 0;
let realtimeClient = null;
let realtimeChannel = null;
let realtimeMode = false;
let realtimeRoom = '';
let realtimeReady = false;
let realtimeRemoteReady = false;
let realtimeHelloTimer = 0;
let realtimeClientId = '';
let realtimeGuestId = '';

function setStatus(message) {
  status.textContent = message;
}

function connectionHelp(error) {
  const type = error?.type || error?.name || '';
  if (type === 'peer-unavailable') {
    return 'The host is offline or this invite has expired. Ask them to create a fresh invite and keep the trainer open.';
  }
  if (type === 'webrtc' || type === 'connection-failed') {
    return 'Your browsers could not make a direct link. Keep both pages open and retry; some school, mobile, or work networks block direct connections.';
  }
  if (type === 'network' || type === 'socket-error' || type === 'socket-closed') {
    return 'The invite service lost its internet connection. Check both devices are online, then press Join session again.';
  }
  return 'The crew link could not connect. Keep the host page open, then press Join session to retry.';
}

function selection() {
  const [world, region] = mission.value.split('|');
  return { world, region, level: level.value };
}

function send(message) {
  if (realtimeModeConnected()) {
    realtimeChannel.send({ type: 'broadcast', event: 'message', payload: { ...message, _sender: realtimeClientId } }).catch(() => {
      setStatus('The relay briefly lost connection. Keep both pages open while it reconnects.');
    });
    return;
  }
  if (connection?.open) connection.send(message);
}

function realtimeModeConnected() {
  return Boolean(realtimeReady && realtimeChannel);
}

function isConnected() {
  return realtimeModeConnected() ? realtimeRemoteReady : Boolean(connection?.open);
}

function setSelection(value) {
  if (!value || !value.world || !value.region || !value.level) return;
  mission.value = `${value.world}|${value.region}`;
  level.value = value.level;
}

function openPanel() {
  panel.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
}

function updateRoleControls() {
  const isGuest = role === 'guest';
  mission.disabled = isGuest;
  level.disabled = isGuest;
  hostButton.disabled = isGuest || Boolean(peer) || realtimeMode;
  const connected = isConnected();
  startButton.disabled = !connected;
  startButton.textContent = isGuest ? 'Request mission start' : 'Start mission together';
  chatInput.disabled = !connected;
  chatSend.disabled = !connected;
  voiceButton.disabled = !connected || realtimeModeConnected();
  voiceEndButton.disabled = !connected || !localStream || realtimeModeConnected();
  if (realtimeModeConnected()) voiceMessage('Mission data and text use the relay. Voice needs a separate media relay and is unavailable in this session.');
}

function showMessage(sender, text, own = false) {
  chatLog.querySelector('.chat-empty')?.remove();
  const row = document.createElement('p');
  row.className = `chat-message${own ? ' mine' : ''}`;
  const heading = document.createElement('b');
  heading.textContent = sender;
  const body = document.createElement('span');
  body.textContent = String(text).slice(0, 400);
  row.append(heading, body);
  chatLog.append(row);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function voiceMessage(message) {
  voiceStatus.textContent = message;
}

function closeVoiceCall() {
  const call = activeCall;
  activeCall = null;
  if (call) call.close();
  remoteAudio.srcObject = null;
  remoteAudio.hidden = true;
}

function watchVoiceCall(call) {
  activeCall = call;
  call.on('stream', stream => {
    remoteAudio.hidden = false;
    remoteAudio.srcObject = stream;
    remoteAudio.play().then(() => voiceMessage('Voice connected. Use the microphone button to mute or unmute.'))
      .catch(() => voiceMessage('Voice connected. Tap Play on the audio control to hear your crew mate.'));
  });
  call.on('close', () => {
    if (activeCall === call) {
      activeCall = null;
      remoteAudio.srcObject = null;
      voiceMessage('Voice link ended. You can start it again from this panel.');
    }
  });
  call.on('error', () => voiceMessage('Voice could not connect. Check microphone permission and try again.'));
}

function startVoiceCall() {
  if (role !== 'host' || !localStream || !remoteVoiceReady || !isConnected() || realtimeModeConnected() || activeCall) return;
  const call = peer.call(connection.peer, localStream);
  watchVoiceCall(call);
  voiceMessage('Calling your crew mate…');
}

function stopLocalVoice() {
  localStream?.getTracks().forEach(track => track.stop());
  localStream = null;
  voiceButton.textContent = 'Enable microphone';
  voiceEndButton.disabled = true;
  closeVoiceCall();
}

async function toggleMicrophone() {
  if (!localStream) {
    if (!navigator.mediaDevices?.getUserMedia) {
      voiceMessage('This browser cannot use a microphone here. Try a current browser on the secure website.');
      return;
    }
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      voiceMessage(error?.name === 'NotAllowedError'
        ? 'Microphone permission was not allowed. Use the browser permission control, then try again.'
        : 'Could not open a microphone. Check that one is connected, then try again.');
      return;
    }
    localStream.getAudioTracks().forEach(track => { track.enabled = true; });
    voiceButton.textContent = 'Mute microphone';
    send({ type: 'voice-ready', ready: true });
    voiceMessage('Microphone is on. Your crew mate must also enable theirs to start voice chat.');
    updateRoleControls();
    startVoiceCall();
    return;
  }

  const track = localStream.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  voiceButton.textContent = track.enabled ? 'Mute microphone' : 'Unmute microphone';
  voiceMessage(track.enabled ? 'Microphone is on.' : 'Microphone is muted. You can still hear your crew mate.');
}

function endVoice() {
  send({ type: 'voice-ready', ready: false });
  stopLocalVoice();
  voiceMessage('Voice chat ended. Your text chat stays connected.');
}

function sendChat(event) {
  event.preventDefault();
  const text = chatInput.value.trim().slice(0, 400);
  if (!text || !isConnected()) return;
  send({ type: 'chat', text, sender: role === 'host' ? 'Player 1 · Engineer' : 'Player 2 · Scientist' });
  showMessage('You', text, true);
  chatInput.value = '';
}

function inviteUrl(peerId, transport = 'peer') {
  const url = new URL(location.href);
  url.search = '';
  if (transport === 'relay') {
    url.searchParams.set('room', peerId);
    url.searchParams.set('transport', 'relay');
  } else url.searchParams.set('join', peerId);
  return url.href;
}

async function copyInvite() {
  inviteLink.focus();
  inviteLink.select();
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    setStatus('Invite link copied. Send it to one crew mate.');
  } catch {
    setStatus('Select and copy the invite link, then send it to one crew mate.');
  }
}

function startLocalMission(value) {
  setSelection(value);
  document.querySelector(`[data-level="${value.level}"]`)?.click();
  document.querySelector(`[data-destination="${value.world}"][data-region="${value.region}"]`)?.click();
  window.dispatchEvent(new CustomEvent('outpost:online-role', { detail: { role: role === 'host' ? 1 : 2 } }));
}

function startMissionTogether() {
  const value = selection();
  if (role === 'guest') {
    send({ type: 'mission-start-request' });
    setStatus('Start request sent to the host. Your crew mate will start both explorers.');
    return;
  }
  if (role !== 'host' || !isConnected()) return;
  startLocalMission(value);
  send({ type: 'mission-start', selection: value });
  setStatus('Mission started on both devices. Player 1 is Engineer; Player 2 is Scientist.');
}

function handleMessage(message) {
  if (!message || typeof message !== 'object') return;
  if (realtimeMode && message.recipient && message.recipient !== realtimeClientId) return;
  if (realtimeMode && role === 'host' && realtimeGuestId && message._sender && message._sender !== realtimeGuestId) return;
  if (message.type === 'chat' && typeof message.text === 'string') {
    showMessage(message.sender || 'Crew mate', message.text);
  }
  if (message.type === 'voice-ready') {
    remoteVoiceReady = Boolean(message.ready);
    if (role === 'host' && remoteVoiceReady) startVoiceCall();
    if (role === 'host' && !remoteVoiceReady && activeCall) {
      closeVoiceCall();
      voiceMessage('Your crew mate ended voice chat. Text chat stays connected.');
    }
    if (!remoteVoiceReady && role === 'guest' && activeCall) closeVoiceCall();
    if (remoteVoiceReady && !localStream) voiceMessage('Your crew mate is ready for voice. Enable your microphone to join.');
  }
  if (message.type === 'hello' && role === 'host') {
    if (realtimeMode) {
      if (realtimeGuestId && realtimeGuestId !== message._sender) return;
      realtimeGuestId = message._sender || '';
      realtimeRemoteReady = true;
      send({ type: 'hello-ack', recipient: realtimeGuestId });
    }
    setStatus('Crew mate connected. Choose a mission and start together.');
    send({ type: 'mission-selection', selection: selection() });
    updateRoleControls();
  }
  if (message.type === 'hello-ack' && role === 'guest' && realtimeMode) {
    realtimeRemoteReady = true;
    window.clearInterval(realtimeHelloTimer);
    realtimeHelloTimer = 0;
    setStatus('Connected through the relay. You are Player 2 · Scientist.');
    updateRoleControls();
  }
  if (message.type === 'mission-selection' && role === 'guest') {
    setSelection(message.selection);
    setStatus('Connected to the host. Waiting for them to start the mission.');
  }
  if (message.type === 'mission-start' && role === 'guest') {
    setSelection(message.selection);
    startLocalMission(message.selection);
    setStatus('Mission selected on both devices. You are connected as Player 2.');
    updateRoleControls();
  }
  if (message.type === 'ready' && role === 'host') {
    setStatus('Crew mate connected and ready. Choose a mission, then start together.');
  }
  if (message.type === 'mission-start-request' && role === 'host') startMissionTogether();
  if (message.type === 'trainer-state' && message.state) {
    window.dispatchEvent(new CustomEvent('outpost:crew-state', { detail: message.state }));
  }
  if (message.action) window.dispatchEvent(new CustomEvent('outpost:crew-action', { detail: message }));
}

function attachConnection(conn) {
  if (connection?.open) {
    conn.close();
    return;
  }
  connection = conn;
  connection.on('open', () => {
    lastConnectionIssue = '';
    inviteBox.hidden = false;
    if (role === 'guest') {
      inviteLink.value = location.href;
      connection.send({ type: 'hello' });
      setStatus('Connected. Waiting for the host to choose a mission.');
    } else {
      setStatus('Crew mate connected. Choose a mission and start together.');
      send({ type: 'mission-selection', selection: selection() });
    }
    voiceMessage('Connected. Text chat is ready; both players can enable their microphones for voice.');
    updateRoleControls();
  });
  connection.on('data', handleMessage);
  connection.on('close', () => {
    connection = null;
    remoteVoiceReady = false;
    stopLocalVoice();
    startButton.disabled = true;
    const recentIssue = lastConnectionIssue && Date.now() - lastConnectionIssueAt < 8000;
    setStatus(recentIssue ? lastConnectionIssue : 'Crew mate disconnected. Join again, or create a fresh invite if you are the host.');
    updateRoleControls();
  });
  connection.on('error', error => {
    // PeerJS may emit the useful cause on the Peer immediately before the
    // DataConnection error. Keep that more specific guidance visible.
    if (Date.now() - lastPeerErrorAt < 1800) return;
    lastConnectionIssue = connectionHelp(error);
    lastConnectionIssueAt = Date.now();
    setStatus(lastConnectionIssue);
    updateRoleControls();
  });
}

function makePeer() {
  if (peer) return peer;
  if (!window.Peer) {
    setStatus('The online connection service did not load. Check your internet connection and refresh.');
    return null;
  }
  peer = new window.Peer();
  peer.on('open', () => { peerReady = true; });
  peer.on('error', error => {
    lastPeerErrorAt = Date.now();
    lastConnectionIssue = connectionHelp(error);
    lastConnectionIssueAt = lastPeerErrorAt;
    setStatus(lastConnectionIssue);
    if (role === 'host' && !inviteLink.value) {
      peer?.destroy();
      peer = null;
      peerReady = false;
      hostButton.disabled = false;
    }
    updateRoleControls();
  });
  peer.on('call', call => {
    if (role !== 'guest' || !localStream) {
      call.close();
      voiceMessage('Enable your microphone before your crew mate starts voice chat.');
      return;
    }
    watchVoiceCall(call);
    call.answer(localStream);
    voiceMessage('Connecting voice chat…');
  });
  return peer;
}

function relayConfigured() {
  const config = window.OUTPOST_REALTIME_CONFIG;
  return Boolean(config?.url && config?.publishableKey);
}

async function connectRealtimeRoom(room, asHost) {
  const config = window.OUTPOST_REALTIME_CONFIG;
  if (!config?.url || !config?.publishableKey) return false;
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    realtimeMode = true;
    realtimeRoom = room;
    realtimeClientId = crypto.randomUUID();
    realtimeGuestId = '';
    realtimeReady = false;
    realtimeRemoteReady = false;
    realtimeClient = createClient(config.url, config.publishableKey, { realtime: { params: { eventsPerSecond: 20 } } });
    realtimeChannel = realtimeClient.channel(`outpost-${room}`, { config: { private: false, broadcast: { ack: true, self: false } } });
    realtimeChannel.on('broadcast', { event: 'message' }, ({ payload }) => handleMessage(payload));
    realtimeChannel.subscribe(state => {
      if (state === 'SUBSCRIBED') {
        realtimeReady = true;
        inviteBox.hidden = false;
        if (asHost) {
          inviteLink.value = inviteUrl(room, 'relay');
          setStatus('Relay invite ready. Keep this page open while your crew mate joins.');
          copyInvite();
        } else {
          inviteLink.value = location.href;
          setStatus('Relay connected. Waiting for the host to accept your crew link…');
          send({ type: 'hello' });
          realtimeHelloTimer = window.setInterval(() => {
            if (!realtimeRemoteReady) send({ type: 'hello' });
          }, 1800);
        }
        updateRoleControls();
      } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT' || state === 'CLOSED') {
        realtimeReady = false;
        realtimeRemoteReady = false;
        setStatus('The relay service could not stay connected. Check its project URL and publishable key, then retry.');
        updateRoleControls();
      }
    });
    return true;
  } catch (error) {
    realtimeMode = false;
    realtimeReady = false;
    realtimeRemoteReady = false;
    setStatus('The relay library could not load. Check internet access, then try again.');
    return false;
  }
}

async function createRealtimeInvite() {
  role = 'host';
  openPanel();
  const room = crypto.randomUUID();
  setStatus('Starting a relayed invite session…');
  await connectRealtimeRoom(room, true);
}

async function joinRealtimeInvite(room) {
  role = 'guest';
  openPanel();
  inviteBox.hidden = false;
  inviteLink.value = location.href;
  setStatus('Connecting to the relay and host…');
  await connectRealtimeRoom(room, false);
}

function createInvite() {
  if (relayConfigured()) {
    createRealtimeInvite();
    return;
  }
  role = 'host';
  openPanel();
  const host = makePeer();
  if (!host) return;
  setStatus('Connecting to the invite service…');
  hostButton.disabled = true;
  const ready = id => {
    inviteLink.value = inviteUrl(id);
    inviteBox.hidden = false;
    setStatus('Invite ready. Keep this page open while your crew mate joins.');
    updateRoleControls();
    copyInvite();
  };
  if (peerReady && host.id) ready(host.id);
  else host.once('open', ready);
  host.on('connection', attachConnection);
}

function peerIdFrom(value) {
  const text = value.trim();
  if (!text) return '';
  try {
    const url = new URL(text, location.href);
    return url.searchParams.get('join') || text;
  } catch {
    return text;
  }
}

function joinInvite(value) {
  try {
    const invite = new URL(value.trim(), location.href);
    const room = invite.searchParams.get('room');
    if (room) {
      joinRealtimeInvite(room);
      return;
    }
  } catch {}
  const id = peerIdFrom(value);
  if (!id) {
    setStatus('Paste an invite link or enter the host code first.');
    return;
  }
  role = 'guest';
  openPanel();
  inviteBox.hidden = false;
  inviteLink.value = location.href;
  const guest = makePeer();
  if (!guest) return;
  if (isConnected()) {
    setStatus('You are already connected to a crew mate.');
    return;
  }
  setStatus('Connecting to the host…');
  updateRoleControls();
  const attempt = ++joinAttempt;
  const connect = () => {
    if (attempt !== joinAttempt || isConnected()) return;
    attachConnection(guest.connect(id, { reliable: true }));
    window.setTimeout(() => {
      if (attempt === joinAttempt && !isConnected() && status.textContent === 'Connecting to the host…') {
        setStatus('Still trying to reach the host. Keep both pages open; if this takes over 15 seconds, tap Join session again.');
      }
    }, 15000);
  };
  if (peerReady) connect();
  else guest.once('open', connect);
}

toggle.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  toggle.setAttribute('aria-expanded', String(!panel.hidden));
});
$('#online-close').addEventListener('click', () => {
  panel.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();
});
hostButton.addEventListener('click', createInvite);
$('#online-copy').addEventListener('click', copyInvite);
$('#online-join').addEventListener('click', () => joinInvite($('#online-code').value));
$('#chat-form').addEventListener('submit', sendChat);
voiceButton.addEventListener('click', toggleMicrophone);
voiceEndButton.addEventListener('click', endVoice);
$('#online-code').addEventListener('keydown', event => {
  if (event.key === 'Enter') joinInvite($('#online-code').value);
});
mission.addEventListener('change', () => send({ type: 'mission-selection', selection: selection() }));
level.addEventListener('change', () => send({ type: 'mission-selection', selection: selection() }));
startButton.addEventListener('click', () => {
  if (!isConnected()) return;
  startMissionTogether();
});

window.OutpostMultiplayer = {
  role: () => role === 'host' ? 1 : role === 'guest' ? 2 : 0,
  connected: isConnected,
  sendState: state => send({ type: 'trainer-state', state }),
  sendCommand: message => send(message)
};

const incomingParams = new URLSearchParams(location.search);
if (incomingParams.get('room')) joinRealtimeInvite(incomingParams.get('room'));
else if (incomingParams.get('join')) joinInvite(incomingParams.get('join'));

window.addEventListener('pagehide', () => peer?.destroy());

