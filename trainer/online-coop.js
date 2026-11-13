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

function setStatus(message) {
  status.textContent = message;
}

function selection() {
  const [world, region] = mission.value.split('|');
  return { world, region, level: level.value };
}

function send(message) {
  if (connection?.open) connection.send(message);
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
  hostButton.disabled = isGuest || Boolean(peer);
  startButton.disabled = isGuest || !connection?.open;
  const connected = Boolean(connection?.open);
  chatInput.disabled = !connected;
  chatSend.disabled = !connected;
  voiceButton.disabled = !connected;
  voiceEndButton.disabled = !connected || !localStream;
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
  if (role !== 'host' || !localStream || !remoteVoiceReady || !connection?.open || activeCall) return;
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
  if (!text || !connection?.open) return;
  send({ type: 'chat', text, sender: role === 'host' ? 'Player 1 · Engineer' : 'Player 2 · Scientist' });
  showMessage('You', text, true);
  chatInput.value = '';
}

function inviteUrl(peerId) {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('join', peerId);
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
}

function handleMessage(message) {
  if (!message || typeof message !== 'object') return;
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
    setStatus('Crew mate connected. Choose a mission and start together.');
    send({ type: 'mission-selection', selection: selection() });
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
}

function attachConnection(conn) {
  if (connection?.open) {
    conn.close();
    return;
  }
  connection = conn;
  connection.on('open', () => {
    if (role === 'guest') {
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
    setStatus('Crew mate disconnected. Create or join a new invite to reconnect.');
    updateRoleControls();
  });
  connection.on('error', () => setStatus('The crew connection was interrupted. Try the invite link again.'));
}

function makePeer() {
  if (peer) return peer;
  if (!window.Peer) {
    setStatus('The online connection service did not load. Check your internet connection and refresh.');
    return null;
  }
  peer = new window.Peer();
  peer.on('error', error => {
    const text = error?.type === 'peer-unavailable'
      ? 'That invite is no longer available. Ask the host to create a new link.'
      : 'Could not connect through the online service. Try again in a moment.';
    setStatus(text);
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

function createInvite() {
  role = 'host';
  openPanel();
  const host = makePeer();
  if (!host) return;
  setStatus('Connecting to the invite service…');
  hostButton.disabled = true;
  host.on('open', id => {
    inviteLink.value = inviteUrl(id);
    inviteBox.hidden = false;
    setStatus('Invite ready. Waiting for one crew mate to join.');
    updateRoleControls();
    copyInvite();
  });
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
  const id = peerIdFrom(value);
  if (!id) {
    setStatus('Paste an invite link or enter the host code first.');
    return;
  }
  role = 'guest';
  openPanel();
  const guest = makePeer();
  if (!guest) return;
  setStatus('Connecting to the host…');
  updateRoleControls();
  guest.on('open', () => attachConnection(guest.connect(id, { reliable: true })));
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
  if (!connection?.open || role !== 'host') return;
  const value = selection();
  startLocalMission(value);
  send({ type: 'mission-start', selection: value });
  setStatus('Mission started. Your crew mate has the same world and site selected.');
});

const incomingInvite = new URLSearchParams(location.search).get('join');
if (incomingInvite) joinInvite(incomingInvite);

window.addEventListener('pagehide', () => peer?.destroy());

