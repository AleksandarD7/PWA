const CACHE_NAME = 'temperature-converter-v2'; // 🆕 Make sure to update this on new deploys

const ASSETS_TO_CACHE = [
  '/',
  '/converter.js',
  '/converter.css'
];

// 🔧 Install event - cache app shell and activate immediately
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS_TO_CACHE);
    self.skipWaiting(); // ⏩ Activate new SW immediately
  })());
});

// 🧹 Activate event - delete old caches and take control of clients
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    clients.claim(); // 👑 Take control of open tabs
  })());
});

// 📦 Fetch event - respond with cache, then network
self.addEventListener('fetch', event => {
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
      // Optional: return fallback page here if needed
    }
  })());
});

// 🔁 Listen for SKIP_WAITING message from client
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
