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
let peer = null;
let connection = null;
let role = null;

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
    updateRoleControls();
  });
  connection.on('data', handleMessage);
  connection.on('close', () => {
    connection = null;
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

