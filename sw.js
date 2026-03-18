// 定義快取的名稱和需要快取的檔案列表
const CACHE_NAME = 'financial-calculator-v3'; // 更新至 v3 以強制瀏覽器更新 index.html
const URLS_TO_CACHE = [
    '/',
    'index.html',
    'manifest.json',
    'icon-192x192.png',
    'icon-512x512.png',
    'money-logo.png',
    'https://cdn.jsdelivr.net/npm/chart.js',
    // 同步 index.html 使用的 qrcode.min.js 庫
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap'
];

// 1. 安裝 Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache v3');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// 2. 攔截網路請求
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response; // 從快取返回
                }
                return fetch(event.request); // 從網路請求
            })
    );
});

// 3. 啟用 Service Worker 並清除舊快取
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // 刪除所有舊的快取 (v1, v2 等)
                    }
                })
            );
        })
    );
});
