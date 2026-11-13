const CACHE = 'outpost-explorers-v11';
const BASE = new URL('./', self.location.href);
const SHELL = [
  'index.html','style.css','app.js?v=7','mission-demo.js?v=7','missions.js','explore.html','explore.css',
  'explore-launch.js','expedition.js?v=tradeoffs-1','expedition-missions.js?v=tradeoffs-1','pwa.js','manifest.webmanifest',
  'assets/moon.jpg','assets/mars.jpg','assets/moon-lroc-color.jpg','assets/moon-lola-height.jpg',
  'assets/icon-192.png','assets/icon-512.png','vendor/three.module.js','vendor/three.core.js',
  'vendor/OrbitControls.js','vendor/THREE-LICENSE.txt'
].map(path => new URL(path, BASE).href);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('outpost-explorers-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') return caches.match(new URL('index.html', BASE).href);
      return new Response('You are offline. Reconnect to download this part of the expedition.', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
    }
  })());
});

