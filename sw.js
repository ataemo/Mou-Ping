// Service Worker ພື້ນຖານ ສຳລັບ PWA "ໝູປີ້ງ"
// ໜ້າທີ່: ຊ່ວຍໃຫ້ browser ຮັບຮູ້ວ່າເວັບນີ້ຕິດຕັ້ງເປັນແອັບໄດ້ (installable)
// ແລະ cache ໜ້າຫຼັກໄວ້ໃຫ້ໂຫຼດໄວຂຶ້ນ / ເປີດໄດ້ເມື່ອເນັດຊ້າ

const CACHE_NAME = 'moupink-cache-v3';
const PRECACHE_URLS = ['./'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // network-first: ພະຍາຍາມໂຫຼດຈາກເນັດກ່ອນ, ຖ້າບໍ່ໄດ້ຄ່ອຍໃຊ້ cache
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
