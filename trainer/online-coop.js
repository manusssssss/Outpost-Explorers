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
let room = null;
let roomCode = '';
let role = null;
let remoteReady = false;
let localMic = null;
let remoteAudioTrack = null;
let joinTimer = 0;
let connecting = false;

function setStatus(message) { status.textContent = message; }
function config() { return window.OUTPOST_LIVEKIT_CONFIG || {}; }
function readyConfig() { return Boolean(config().serverUrl && config().tokenUrl); }
function isConnected() { return Boolean(room && remoteReady && room.state === 'connected'); }
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
function voiceMessage(message) { voiceStatus.textContent = message; }
function updateControls() {
  const guest = role === 'guest';
  mission.disabled = guest;
  level.disabled = guest;
  hostButton.disabled = connecting || Boolean(room);
  const connected = isConnected();
  startButton.disabled = !connected;
  startButton.textContent = guest ? 'Request mission start' : 'Start mission together';
  chatInput.disabled = !connected;
  chatSend.disabled = !connected;
  voiceButton.disabled = !connected;
  voiceEndButton.disabled = !connected || !localMic;
}
async function send(message) {
  if (!room || room.state !== 'connected') return;
  try {
    const data = encoder.encode(JSON.stringify(message));
    await room.localParticipant.publishData(data, {
      reliable: message.type !== 'trainer-state',
      topic: message.type === 'trainer-state' ? 'outpost-state' : 'outpost-control'
    });
  } catch {
    setStatus('Connection paused while sending. Wait for LiveKit to reconnect.');
  }
}
function inviteUrl(code) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('room', code);
  url.searchParams.set('transport', 'livekit');
  return url.href;
}
async function copyInvite() {
  inviteLink.focus();
  inviteLink.select();
  try {
    await navigator.clipboard.writeText(inviteLink.value);
    setStatus('LiveKit invite copied. Send the link to one crew mate.');
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
    setStatus('Start request sent to the host.');
    return;
  }
  if (role !== 'host' || !isConnected()) return;
  startLocalMission(value);
  send({ type: 'mission-start', selection: value });
  setStatus('Mission started for both players. Player 1 is Engineer; Player 2 is Scientist.');
}
function handleMessage(message) {
  if (!message || typeof message !== 'object') return;
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
  if (message.type === 'trainer-state' && message.state) {
    window.dispatchEvent(new CustomEvent('outpost:crew-state', { detail: message.state }));
  }
  if (message.action) window.dispatchEvent(new CustomEvent('outpost:crew-action', { detail: message }));
}
function onData(payload, participant) {
  if (participant?.identity && role === 'host' && !participant.identity.startsWith('guest-')) return;
  if (participant?.identity && role === 'guest' && !participant.identity.startsWith('host-')) return;
  try { handleMessage(JSON.parse(decoder.decode(payload))); } catch { /* Ignore malformed or unrelated room data. */ }
}
function handleParticipantConnected(participant) {
  const expected = role === 'host' ? participant.identity.startsWith('guest-') : participant.identity.startsWith('host-');
  if (!expected) return;
  remoteReady = true;
  if (role === 'host') {
    setStatus('Crew mate connected. Choose a mission, then start together.');
    send({ type: 'mission-selection', selection: selection() });
  } else {
    setStatus('Connected to the host. Loading the mission selection…');
    send({ type: 'hello' });
  }
  voiceMessage('LiveKit voice and text chat are ready. Both players can enable their microphones.');
  updateControls();
}
function handleParticipantDisconnected(participant) {
  if (!participant?.identity?.startsWith(role === 'host' ? 'guest-' : 'host-')) return;
  remoteReady = false;
  setStatus('Crew mate disconnected. Rejoin with the same invite if the room is still open.');
  voiceMessage('Voice disconnected. Your microphone is still muted locally.');
  updateControls();
}
async function getToken(code, asHost) {
  const response = await fetch(config().tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room: code, role: asHost ? 'host' : 'guest' })
  });
  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new Error(details.error || `Token service returned ${response.status}`);
  }
  return response.json();
}
async function connectRoom(code, asHost) {
  if (!readyConfig()) {
    setStatus('LiveKit is not configured yet. Add the public LiveKit server URL and deployed token Worker URL in livekit-config.js.');
    return;
  }
  if (!window.LivekitClient?.Room) {
    setStatus('LiveKit client did not load. Check your internet connection and refresh.');
    return;
  }
  if (connecting || room) return;
  connecting = true;
  role = asHost ? 'host' : 'guest';
  roomCode = code;
  updateControls();
  setStatus(asHost ? 'Creating your private LiveKit room…' : 'Connecting to the host through LiveKit…');
  try {
    const { token } = await getToken(code, asHost);
    const liveRoom = new window.LivekitClient.Room({
      adaptiveStream: true,
      dynacast: true,
      disconnectOnPageLeave: true
    });
    room = liveRoom;
    liveRoom.on(window.LivekitClient.RoomEvent.DataReceived, onData);
    liveRoom.on(window.LivekitClient.RoomEvent.ParticipantConnected, handleParticipantConnected);
    liveRoom.on(window.LivekitClient.RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    liveRoom.on(window.LivekitClient.RoomEvent.TrackSubscribed, (track) => {
      if (track.kind !== window.LivekitClient.Track.Kind.Audio) return;
      remoteAudioTrack = track;
      remoteAudio.hidden = false;
      track.attach(remoteAudio);
      remoteAudio.play().then(() => voiceMessage('Voice connected. Use the microphone button to mute or unmute.'))
        .catch(() => voiceMessage('Voice connected. Tap Play on the audio control to hear your crew mate.'));
    });
    liveRoom.on(window.LivekitClient.RoomEvent.TrackUnsubscribed, track => {
      if (track === remoteAudioTrack) {
        track.detach(remoteAudio);
        remoteAudioTrack = null;
        remoteAudio.hidden = true;
      }
    });
    liveRoom.on(window.LivekitClient.RoomEvent.Disconnected, () => {
      remoteReady = false;
      if (room === liveRoom) room = null;
      clearTimeout(joinTimer);
      connecting = false;
      setStatus('LiveKit disconnected. Check your connection, then join the invite again.');
      updateControls();
    });
    await liveRoom.connect(config().serverUrl, token);
    connecting = false;
    inviteBox.hidden = false;
    inviteLink.value = asHost ? inviteUrl(code) : location.href;
    if (asHost) {
      setStatus('LiveKit room is ready. Keep this page open while your crew mate joins.');
      copyInvite();
    } else {
      setStatus('Connected to the LiveKit room; waiting for the host…');
      send({ type: 'hello' });
      joinTimer = window.setTimeout(() => {
        if (!remoteReady && room === liveRoom) {
          setStatus('No host appeared in this room. Check the invite link and try again.');
          liveRoom.disconnect();
        }
      }, 18000);
    }
    for (const participant of liveRoom.remoteParticipants.values()) handleParticipantConnected(participant);
    updateControls();
  } catch (error) {
    room = null;
    remoteReady = false;
    connecting = false;
    setStatus(`LiveKit could not connect: ${String(error?.message || error).slice(0, 220)}. Check the room link and token service.`);
    updateControls();
  }
}
function createInvite() {
  openPanel();
  if (!readyConfig()) {
    setStatus('LiveKit is not configured yet. Add the public LiveKit server URL and deployed token Worker URL in livekit-config.js.');
    return;
  }
  const code = crypto.randomUUID().replaceAll('-', '');
  inviteBox.hidden = false;
  inviteLink.value = inviteUrl(code);
  connectRoom(code, true);
}
function roomFromInput(value) {
  const text = value.trim();
  if (!text) return '';
  try {
    const url = new URL(text, location.href);
    return url.searchParams.get('room') || text;
  } catch { return text; }
}
function joinInvite(value) {
  const code = roomFromInput(value);
  if (!code) { setStatus('Paste a LiveKit invite link or room code first.'); return; }
  if (!/^[a-f0-9-]{16,64}$/i.test(code)) { setStatus('That invite code does not look valid. Paste the full link or room code.'); return; }
  openPanel();
  inviteBox.hidden = false;
  connectRoom(code, false);
}
async function toggleMicrophone() {
  if (!room || !isConnected()) return;
  if (!localMic) {
    if (!navigator.mediaDevices?.getUserMedia) {
      voiceMessage('This browser cannot use a microphone here. Open the secure website in a current browser.');
      return;
    }
    try {
      localMic = await window.LivekitClient.createLocalAudioTrack({ echoCancellation: true, noiseSuppression: true, autoGainControl: true });
      await room.localParticipant.publishTrack(localMic);
      voiceButton.textContent = 'Mute microphone';
      voiceEndButton.disabled = false;
      voiceMessage('Microphone is on. Your crew mate can hear you.');
    } catch (error) {
      localMic = null;
      voiceMessage(error?.name === 'NotAllowedError' ? 'Microphone permission was not allowed. Change the browser permission, then try again.' : 'Could not start voice. Check microphone permission and connection.');
    }
    updateControls();
    return;
  }
  if (localMic.isMuted) {
    await localMic.unmute();
    voiceButton.textContent = 'Mute microphone';
    voiceMessage('Microphone is on.');
  } else {
    await localMic.mute();
    voiceButton.textContent = 'Unmute microphone';
    voiceMessage('Microphone is muted. You can still hear your crew mate.');
  }
}
async function endVoice() {
  if (!localMic) return;
  try {
    await room?.localParticipant.unpublishTrack(localMic);
    localMic.stop();
  } catch { /* The room may already be disconnected. */ }
  localMic = null;
  voiceButton.textContent = 'Enable microphone';
  voiceMessage('Voice chat ended. Your text chat stays connected.');
  updateControls();
}
function sendChat(event) {
  event.preventDefault();
  const text = chatInput.value.trim().slice(0, 400);
  if (!text || !isConnected()) return;
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
startButton.addEventListener('click', () => { if (isConnected()) startMissionTogether(); });
window.OutpostMultiplayer = {
  role: () => role === 'host' ? 1 : role === 'guest' ? 2 : 0,
  connected: isConnected,
  sendState: state => send({ type: 'trainer-state', state }),
  sendCommand: message => send(message)
};
const incoming = new URLSearchParams(location.search);
if (incoming.get('room') && incoming.get('transport') === 'livekit') joinInvite(location.href);
window.addEventListener('pagehide', () => {
  clearTimeout(joinTimer);
  if (localMic) { localMic.stop(); localMic = null; }
  room?.disconnect();
});
updateControls();
if (!readyConfig()) setStatus('LiveKit ready to configure. Set the LiveKit server and token-service URLs to enable online co-op.');

