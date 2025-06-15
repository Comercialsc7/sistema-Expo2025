// Nome do cache
const CACHE_NAME = 'expo2025-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/icon.png',
  // Adicione outros arquivos importantes aqui
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Forçar o modo standalone em navegadores suportados
self.addEventListener('beforeinstallprompt', (event) => {
  event.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      window.matchMedia('(display-mode: standalone)').matches;
    }
  });
}); 