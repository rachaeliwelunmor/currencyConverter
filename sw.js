const cacheName = 'currency-001';
const name = 'currConverter';

const cacheFiles = [
    '/udacity/',
    '/udacity/index.html',
    '/udacity/css/style.css',
    '/udacity/js/app.js',
];

self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(name).then(cache => {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== name) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});


self.addEventListener('fetch', event => {
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

    if (event.request.url.indexOf(url) === 0) {
        event.respondWith(
            fetch(event.request).then(response =>
                caches.open(cacheName).then(cache => {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            )
        );
    } else {
        event.respondWith(
            caches
                .match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});
