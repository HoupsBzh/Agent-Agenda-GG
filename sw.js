// Service Worker — Agent Agenda PWA
const CACHE = 'agent-agenda-v1';
const ASSETS = [
  '/Agent-Agenda-GG/',
  '/Agent-Agenda-GG/index.html',
  '/Agent-Agenda-GG/manifest.json',
  '/Agent-Agenda-GG/icons/icon-192.png',
  '/Agent-Agenda-GG/icons/icon-512.png',
];

// Installation — mise en cache des ressources statiques
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// Activation — nettoyage des anciens caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — stratégie Network-first pour l'API GAS, Cache-first pour les assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // POST vers GAS → toujours réseau (jamais cacher les appels API)
  if (e.request.method === 'POST') return;

  // Google Fonts → réseau avec fallback cache
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      fetch(e.request)
        .then(r => { caches.open(CACHE).then(c => c.put(e.request, r.clone())); return r; })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Assets statiques → Cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (r && r.status === 200) {
          const clone = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return r;
      }).catch(() => caches.match('/index.html'));
    })
  );
});
