const CACHE_NAME = "heartbox-pwa-v1-9-12";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=1.9.8",
  "./app.js?v=1.9.8",
  "./manifest.json?v=1.9.8",
  "./style.css?v=1.9.8",
  "./style.css?v=1.9.9",
  "./style.css?v=1.9.10",
  "./style.css?v=1.9.11",
  "./style.css?v=1.9.12",
  "./app.js?v=1.9.8",
  "./app.js?v=1.9.9",
  "./app.js?v=1.9.10",
  "./app.js?v=1.9.11",
  "./app.js?v=1.9.12",
  "./manifest.json?v=1.9.8",
  "./manifest.json?v=1.9.9",
  "./manifest.json?v=1.9.10",
  "./manifest.json?v=1.9.11",
  "./manifest.json?v=1.9.12",
  "./icons/icon-120.png",
  "./icons/icon-152.png",
  "./icons/icon-167.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const PRECACHED_URLS = new Set(ASSETS.map((asset) => new URL(asset, self.location.href).href));

async function putFreshCopy(request) {
  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    putFreshCopy(request).catch(() => {});
    return cached;
  }
  return putFreshCopy(request);
}

async function navigationFallback(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put("./index.html", response.clone());
    }
    return response;
  } catch {
    return (await caches.match("./index.html")) || (await caches.match("./"));
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key.startsWith("heartbox-pwa-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (event.request.mode === "navigate") {
    event.respondWith(navigationFallback(event.request));
    return;
  }

  if (url.origin === self.location.origin && PRECACHED_URLS.has(url.href)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
