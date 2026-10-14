// Progressive Web App Service Worker for SargodhaMart
// Strategy: Cache-first for safe static public assets, network-first for dynamic content.
// Privacy protection: NEVER cache passwords, session credentials, private payments, or admin API tokens.

const CACHE_NAME = 'sargodhamart-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Exclude sensitive paths: never cache API calls, tokens, admin requests, or uploads
  if (
    requestUrl.pathname.startsWith('/api/') ||
    requestUrl.pathname.includes('/auth') ||
    requestUrl.pathname.includes('/admin') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // If valid static resource, cache it
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (requestUrl.pathname.endsWith('.js') ||
              requestUrl.pathname.endsWith('.css') ||
              requestUrl.pathname.endsWith('.png') ||
              requestUrl.pathname.endsWith('.jpg') ||
              requestUrl.pathname.endsWith('.svg'))
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html').then((offlineRes) => offlineRes || caches.match('/'));
          }
        });
    })
  );
});
