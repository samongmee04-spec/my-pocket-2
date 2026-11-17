/* My Pocket 2 service worker: หน้าแอปใช้เวอร์ชันล่าสุดจากเน็ตก่อน ถ้าออฟไลน์ใช้ของที่เก็บไว้ */
const CACHE = 'mypocket2-v1';
const SHELL = ['./','index.html','quick.html','firebase-config.js','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png','icon-quick-192.png','icon-quick-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; })
      .catch(() => caches.match(r).then(m => m || caches.match('index.html'))));
  } else if (u.hostname === 'www.gstatic.com' || u.hostname.endsWith('fonts.googleapis.com') || u.hostname.endsWith('fonts.gstatic.com') || u.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(r, c)); return res; })));
  }
});
