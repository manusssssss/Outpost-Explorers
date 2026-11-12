const installButton = document.querySelector('#install-app');
const help = document.querySelector('#install-help');
let installEvent = null;
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

if (standalone) installButton.textContent = 'App installed ✓';

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installEvent = event;
  installButton.textContent = 'Install app ↓';
});

installButton.addEventListener('click', async () => {
  if (installEvent) {
    await installEvent.prompt();
    await installEvent.userChoice;
    installEvent = null;
    installButton.textContent = 'App installed ✓';
    return;
  }
  if (!standalone) help.showModal();
});

window.addEventListener('appinstalled', () => {
  installEvent = null;
  installButton.textContent = 'App installed ✓';
});

document.querySelector('#install-help-close').addEventListener('click', () => help.close());

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', {scope:'./'}).catch(() => {}));
}
