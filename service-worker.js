const STATIC_CACHE = 'pedrotabs-static-v4';
const DYNAMIC_CACHE = 'pedrotabs-dynamic-v4';

const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.webmanifest',
  '/site-config.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => ![STATIC_CACHE, DYNAMIC_CACHE].includes(key))
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
    await warmDynamicContent();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/tabs/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function handleNavigation(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put('/index.html', response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match('/index.html');
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  const cache = await caches.open(STATIC_CACHE);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function warmDynamicContent() {
  try {
    const configResponse = await fetch('/api/config');
    if (configResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/config', configResponse.clone());
    }
  } catch (error) {
    // Ignore warmup failures.
  }

  try {
    const tabsResponse = await fetch('/api/tabs');
    if (!tabsResponse.ok) {
      return;
    }

    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put('/api/tabs', tabsResponse.clone());
  } catch (error) {
    // Ignore warmup failures.
  }
}
