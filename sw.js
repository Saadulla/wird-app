const CACHE = 'tap-counter-v10';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts/amiri-latin-400.woff2',
  './fonts/amiri-latin-700.woff2',
  './fonts/amiri-arabic-400.woff2',
  './fonts/amiri-arabic-700.woff2',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* ---- daily wird reminders (periodic background sync, Android) ---- */
function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('wird-db', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet(k) {
  try {
    const db = await idbOpen();
    return await new Promise((res) => {
      const q = db.transaction('kv').objectStore('kv').get(k);
      q.onsuccess = () => res(q.result);
      q.onerror = () => res(null);
    });
  } catch (e) { return null; }
}
async function idbSet(k, v) {
  try {
    const db = await idbOpen();
    await new Promise((res) => {
      const t = db.transaction('kv', 'readwrite');
      t.objectStore('kv').put(v, k);
      t.oncomplete = res;
      t.onerror = res;
    });
  } catch (e) {}
}

async function checkReminders() {
  const st = await idbGet('state');
  if (!st || !st.reminders) return;
  const now = new Date();
  const today = now.getFullYear() + '-'
    + String(now.getMonth() + 1).padStart(2, '0') + '-'
    + String(now.getDate()).padStart(2, '0');
  if (st.date !== today) {
    // a new day began while the app was closed: nothing is done yet
    st.date = today;
    for (const r of st.reminders) { r.done = false; r.left = 0; }
  }
  const hhmm = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  let changed = false;
  for (const r of st.reminders) {
    if (r.time && !r.done && r.notifiedOn !== today && hhmm >= r.time) {
      await self.registration.showNotification('🌙 ' + r.name, {
        body: 'Time for your wird — ' + (r.left ? r.left + ' reading' + (r.left === 1 ? '' : 's') + ' left today.' : 'it is waiting for you.'),
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        tag: 'wird-' + r.id
      });
      r.notifiedOn = today;
      changed = true;
    }
  }
  if (changed || st.date === today) await idbSet('state', st);
}

self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'wird-reminders') e.waitUntil(checkReminders());
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ws) =>
      ws.length ? ws[0].focus() : clients.openWindow('./')
    )
  );
});

// cache-first: the app works fully offline once installed
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) => hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
    )
  );
});
