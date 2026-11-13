const q = selector => document.querySelector(selector);
const panel = q('#online-panel');
const toggle = q('#online-toggle');
const status = q('#online-status');
const mission = q('#online-mission');
const level = q('#online-level');
const inviteBox = q('#online-invite');
const inviteLink = q('#online-link');
const hostButton = q('#online-host');
const startButton = q('#online-start');
const chatLog = q('#chat-log');
const chatInput = q('#chat-input');
const chatSend = q('#chat-send');
const voiceButton = q('#voice-toggle');
const voiceEndButton = q('#voice-end');
const voiceStatus = q('#voice-status');
const remoteAudio = q('#remote-audio');
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let socket = null;
let roomCode = '';
let role = null;
let remoteReady = false;
let connecting = false;
let localStream = null;
let peerConnection = null;
let audioSender = null;
let remoteVoiceStream = null;
let pendingIce = [];
let offerStarted = false;

function setStatus(message) { status.textContent = message; }
function config() { return window.OUTPOST_ROOM_CONFIG || {}; }
function configured() { return Boolean(config().websocketUrl); }
function connected() { return Boolean(socket && socket.readyState === WebSocket.OPEN && remoteReady); }
function selection() {
  const [world, region] = mission.value.split('|');
  return { world, region, level: level.value };
}
function setSelection(value) {
  if (!value?.world || !value?.region || !value?.level) return;
  mission.value = `${value.world}|${value.region}`;
  level.value = value.level;
}
function openPanel() {
  panel.hidden = false;
  toggle.setAttribute('aria-expanded', 'true');
}
function updateControls() {
  const guest = role === 'guest';
  mission.disabled = guest;
  level.disabled = guest;
  hostButton.disabled = connecting || Boolean(socket);
  const ready = connected();
  startButton.disabled = !ready;
  startButton.textContent = guest ? 'Request mission start' : 'Start mission together';
  chatInput.disabled = !ready;
  chatSend.disabled = !ready;
  voiceButton.disabled = !ready;
  voiceEndButton.disabled = !ready || !localStream;
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
function send(message) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  try { socket.send(JSON.stringify(message)); }
  catch { setStatus('The room relay stopped sending. Rejoin using the invite link.'); }
}
function inviteUrl(code) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('room', code);
  url.searchParams.set('transport', 'room-relay');
  return url.href;
}
async function copyInvite() {
  inviteLink.focus();
  inviteLink.select();
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    setStatus('Room invite copied. Send the link to one crew mate.');
  } catch { setStatus('Select and copy the invite link, then send it to one crew mate.'); }
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
    setStatus('Start request sent to the host.');
    return;
  }
  if (role !== 'host' || !connected()) return;
  startLocalMission(value);
  send({ type: 'mission-start', selection: value });
  setStatus('Mission started for both players. Player 1 is Engineer; Player 2 is Scientist.');
}
function handleRoomMessage(message) {
  if (!message || typeof message !== 'object') return;
  if (message.type === 'room-state') {
    remoteReady = Boolean(message.peerPresent && message.peerRole !== role);
    if (remoteReady) {
      setStatus(role === 'host' ? 'Crew mate connected. Choose a mission, then start together.' : 'Host found. Waiting for mission selection…');
      updateControls();
      prepareVoice();
      if (role === 'guest') send({ type: 'hello' });
    }
    return;
  }
  if (message.type === 'peer-joined') {
    remoteReady = true;
    setStatus(role === 'host' ? 'Crew mate connected. Choose a mission, then start together.' : 'Connected to the host. Loading mission details…');
    updateControls();
    prepareVoice();
    if (role === 'host') send({ type: 'mission-selection', selection: selection() });
    else send({ type: 'hello' });
    return;
  }
  if (message.type === 'peer-left') {
    remoteReady = false;
    closeVoice();
    setStatus('Crew mate disconnected. Rejoin using the same invite if the room is still open.');
    updateControls();
    return;
  }
  if (message.type === 'chat' && typeof message.text === 'string') showMessage(message.sender || 'Crew mate', message.text);
  if (message.type === 'hello' && role === 'host') {
    send({ type: 'mission-selection', selection: selection() });
    send({ type: 'ready' });
  }
  if (message.type === 'mission-selection' && role === 'guest') {
    setSelection(message.selection);
    setStatus('Connected to the host. Waiting for them to start the mission.');
  }
  if (message.type === 'mission-start' && role === 'guest') {
    setSelection(message.selection);
    startLocalMission(message.selection);
    setStatus('Mission selected on both devices. You are Player 2 · Scientist.');
    updateControls();
  }
  if (message.type === 'mission-start-request' && role === 'host') startMissionTogether();
  if (message.type === 'trainer-state' && message.state) window.dispatchEvent(new CustomEvent('outpost:crew-state', { detail: message.state }));
  if (message.action) window.dispatchEvent(new CustomEvent('outpost:crew-action', { detail: message }));
  if (message.type === 'voice-ready' && role === 'host' && message.ready) beginVoiceNegotiation();
  if (message.type === 'rtc-signal') handleSignal(message.signal);
}
function connectRoom(code, asHost) {
  if (!configured()) {
    setStatus('Room relay is not configured yet. Deploy the included Cloudflare Worker, then add its URL in room-config.js.');
    return;
  }
  if (connecting || socket) return;
  role = asHost ? 'host' : 'guest';
  roomCode = code;
  connecting = true;
  updateControls();
  setStatus(asHost ? 'Connecting to the room relay…' : 'Joining the crew room…');
  let base = config().websocketUrl.trim().replace(/\/+$/, '');
  base = base.replace(/^https:/i, 'wss:').replace(/^http:/i, 'ws:');
  const url = `${base}/room/${encodeURIComponent(code)}?role=${role}`;
  const ws = new WebSocket(url);
  socket = ws;
  ws.addEventListener('open', () => {
    connecting = false;
    inviteBox.hidden = false;
    inviteLink.value = asHost ? inviteUrl(code) : location.href;
    if (asHost) {
      setStatus('Room is ready. Keep this page open while your crew mate joins.');
      copyInvite();
    } else {
      setStatus('Joined the relay. Looking for the host…');
      send({ type: 'hello' });
    }
    updateControls();
  });
  ws.addEventListener('message', event => {
    try { handleRoomMessage(JSON.parse(typeof event.data === 'string' ? event.data : decoder.decode(event.data))); }
    catch { /* Ignore invalid room messages. */ }
  });
  ws.addEventListener('error', () => {
    connecting = false;
    setStatus('Could not reach the room relay. Check its Worker URL and try again.');
    updateControls();
  });
  ws.addEventListener('close', event => {
    connecting = false;
    remoteReady = false;
    if (socket === ws) socket = null;
    closeVoice();
    const reason = event.code === 1008 || event.code === 1013
      ? 'That player slot is occupied or this invite already has two players. Create a fresh invite.'
      : 'The room relay disconnected. Check your connection, then join again.';
    setStatus(reason);
    updateControls();
  });
}
function createInvite() {
  openPanel();
  if (!configured()) {
    setStatus('Deploy the included Cloudflare room relay and set its Worker URL in trainer/room-config.js before creating invites.');
    return;
  }
  const code = crypto.randomUUID().replaceAll('-', '');
  inviteBox.hidden = false;
  inviteLink.value = inviteUrl(code);
  connectRoom(code, true);
}
function parseRoom(value) {
  const text = value.trim();
  if (!text) return '';
  try {
    const url = new URL(text, location.href);
    return url.searchParams.get('room') || text;
  } catch { return text; }
}
function joinInvite(value) {
  const code = parseRoom(value);
  if (!/^[a-f0-9-]{16,64}$/i.test(code)) {
    setStatus('Paste a valid crew invite link or room code first.');
    return;
  }
  openPanel();
  inviteBox.hidden = false;
  connectRoom(code, false);
}
function prepareVoice() {
  if (!connected() || peerConnection) return;
  const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
  peerConnection = pc;
  const transceiver = pc.addTransceiver('audio', { direction: 'sendrecv' });
  audioSender = transceiver.sender;
  if (localStream?.getAudioTracks()[0]) audioSender.replaceTrack(localStream.getAudioTracks()[0]).catch(() => {});
  pc.onicecandidate = event => { if (event.candidate) send({ type: 'rtc-signal', signal: { candidate: event.candidate } }); };
  pc.ontrack = event => {
    remoteVoiceStream = event.streams[0] || new MediaStream([event.track]);
    remoteAudio.srcObject = remoteVoiceStream;
    remoteAudio.hidden = false;
    remoteAudio.play().then(() => { voiceStatus.textContent = 'Voice connected. Use the microphone button to mute or unmute.'; })
      .catch(() => { voiceStatus.textContent = 'Voice connected. Tap Play to hear your crew mate.'; });
  };
  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'failed') voiceStatus.textContent = 'Voice could not connect on this network. Mission data and text chat are still connected.';
  };
  if (role === 'host') beginVoiceNegotiation();
}
async function beginVoiceNegotiation() {
  if (role !== 'host' || !connected()) return;
  prepareVoice();
  if (!peerConnection || offerStarted) return;
  offerStarted = true;
  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    send({ type: 'rtc-signal', signal: { description: peerConnection.localDescription } });
    voiceStatus.textContent = 'Voice link is being prepared. Allow microphone access on both devices.';
  } catch {
    offerStarted = false;
    voiceStatus.textContent = 'Voice setup did not finish. The mission relay is still available.';
  }
}
async function handleSignal(signal) {
  if (!signal || !remoteReady) return;
  prepareVoice();
  const pc = peerConnection;
  if (!pc) return;
  try {
    if (signal.description) {
      await pc.setRemoteDescription(signal.description);
      for (const candidate of pendingIce.splice(0)) await pc.addIceCandidate(candidate);
      if (signal.description.type === 'offer' && role === 'guest') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        send({ type: 'rtc-signal', signal: { description: pc.localDescription } });
      }
    } else if (signal.candidate) {
      if (!pc.remoteDescription) pendingIce.push(signal.candidate);
      else await pc.addIceCandidate(signal.candidate);
    }
  } catch {
    voiceStatus.textContent = 'Voice signaling failed. Game controls and text chat remain connected.';
  }
}
function closeVoice() {
  if (peerConnection) { peerConnection.ontrack = null; peerConnection.close(); }
  peerConnection = null;
  audioSender = null;
  remoteVoiceStream = null;
  pendingIce = [];
  offerStarted = false;
  remoteAudio.srcObject = null;
  remoteAudio.hidden = true;
  localStream?.getTracks().forEach(track => track.stop());
  localStream = null;
  voiceButton.textContent = 'Enable microphone';
  voiceEndButton.disabled = true;
}
async function toggleMicrophone() {
  if (!connected()) return;
  if (!localStream) {
    if (!navigator.mediaDevices?.getUserMedia) {
      voiceStatus.textContent = 'Microphone needs a current browser on the secure website.';
      return;
    }
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      prepareVoice();
      const track = localStream.getAudioTracks()[0];
      if (audioSender) await audioSender.replaceTrack(track);
      voiceButton.textContent = 'Mute microphone';
      voiceEndButton.disabled = false;
      voiceStatus.textContent = 'Microphone is on. Voice uses a direct WebRTC link; some networks block it.';
      send({ type: 'voice-ready', ready: true });
    } catch (error) {
      localStream?.getTracks().forEach(track => track.stop());
      localStream = null;
      voiceStatus.textContent = error?.name === 'NotAllowedError' ? 'Microphone permission was denied. Allow it for this website, then retry.' : 'Could not start the microphone. Check permission and try again.';
    }
    updateControls();
    return;
  }
  const track = localStream.getAudioTracks()[0];
  if (!track) return;
  track.enabled = !track.enabled;
  voiceButton.textContent = track.enabled ? 'Mute microphone' : 'Unmute microphone';
  voiceStatus.textContent = track.enabled ? 'Microphone is on.' : 'Microphone is muted.';
}
function endVoice() {
  localStream?.getTracks().forEach(track => track.stop());
  localStream = null;
  if (audioSender) audioSender.replaceTrack(null).catch(() => {});
  voiceButton.textContent = 'Enable microphone';
  voiceStatus.textContent = 'Microphone is off. Mission data and chat remain connected.';
  updateControls();
}
function sendChat(event) {
  event.preventDefault();
  const text = chatInput.value.trim().slice(0, 400);
  if (!text || !connected()) return;
  send({ type: 'chat', text, sender: role === 'host' ? 'Player 1 · Engineer' : 'Player 2 · Scientist' });
  showMessage('You', text, true);
  chatInput.value = '';
}
toggle.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  toggle.setAttribute('aria-expanded', String(!panel.hidden));
});
q('#online-close').addEventListener('click', () => {
  panel.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.focus();
});
hostButton.addEventListener('click', createInvite);
q('#online-copy').addEventListener('click', copyInvite);
q('#online-join').addEventListener('click', () => joinInvite(q('#online-code').value));
q('#chat-form').addEventListener('submit', sendChat);
voiceButton.addEventListener('click', toggleMicrophone);
voiceEndButton.addEventListener('click', endVoice);
q('#online-code').addEventListener('keydown', event => { if (event.key === 'Enter') joinInvite(q('#online-code').value); });
mission.addEventListener('change', () => send({ type: 'mission-selection', selection: selection() }));
level.addEventListener('change', () => send({ type: 'mission-selection', selection: selection() }));
startButton.addEventListener('click', () => { if (connected()) startMissionTogether(); });
window.OutpostMultiplayer = {
  role: () => role === 'host' ? 1 : role === 'guest' ? 2 : 0,
  connected,
  sendState: state => send({ type: 'trainer-state', state }),
  sendCommand: message => send(message)
};
const incoming = new URLSearchParams(location.search);
if (incoming.get('room') && incoming.get('transport') === 'room-relay') joinInvite(location.href);
window.addEventListener('pagehide', () => {
  closeVoice();
  try { socket?.close(1000, 'page hidden'); } catch { }
});
updateControls();
voiceStatus.textContent = 'Mission chat and state use the room relay. Voice uses a direct peer link and may be blocked on some networks.';
if (!configured()) setStatus('Cloudflare room relay is ready to configure. Add its Worker URL in trainer/room-config.js.');

