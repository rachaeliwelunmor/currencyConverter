const cacheName = 'currency-v-1';
const name = 'currConverter';


const cacheFiles = [
    '/udacity/',
    '/udacity/index.html',
    '/udacity/css/style.css',
    '/udacity/js/app.js',
    'https://free.currencyconverterapi.com/api/v5/countries'
];

self.addEventListener('install', event => {
    console.log('ServiceWorker Installing');
    event.waitUntil(
        caches.open(name).then(cache => {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('ServiceWorker Activating');
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

self.addEventListener('fetch', event =>{
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
