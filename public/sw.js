const CACHE_NAME = 'temperature-converter-v4'; // update version on deploy
const VERSION = '1.0.1'; // update version on deploy


const ASSETS_TO_CACHE = [
  '/',
  '/converter.js',
  '/converter.css',
  '/index.html',
  '/manifest.json',
  '/logo.png',
  '/aspekt2.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS_TO_CACHE);
    self.skipWaiting(); // Activate immediately
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    clients.claim(); // Control open tabs immediately
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    // Network-first strategy for HTML pages (navigation)
    event.respondWith(
      fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        return caches.match(event.request);
      })
    );
  } else {
    // Cache-first strategy for other requests
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      try {
        const fetchResponse = await fetch(event.request);
        cache.put(event.request, fetchResponse.clone());
        return fetchResponse;
      } catch (e) {
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
  }
});

// Respond to SKIP_WAITING message from client
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING' || (event.data && event.data.action === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});
