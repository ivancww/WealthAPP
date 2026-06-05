// 每次更新 index.html 內容時，請務必同時更改呢個版本號 (例如改為 v1.2)
const CACHE_NAME = 'finance-app-v1.20='; 

// 需要被緩存的檔案清單 (確保離線時都能開啟)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // 如果您有 icon 圖片，可以加埋喺度，例如：'./icon-192x192.png'
];

// 1. 安裝階段 (Install)：下載並緩存新檔案
self.addEventListener('install', event => {
  // 強制立刻安裝新版本，跳過等待時間 (Skip Waiting)
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('緩存已開啟:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 激活階段 (Activate)：無情清理舊版本緩存！
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果緩存名稱同最新嘅 CACHE_NAME 唔同，就即刻刪除！
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 發現新版本，正在清除舊緩存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 強制新版本的 Service Worker 立即接管所有開啟中的網頁
      return self.clients.claim();
    })
  );
});

// 3. 攔截請求 (Fetch)：決定點樣提供檔案畀用戶
self.addEventListener('fetch', event => {
  event.respondWith(
    // 策略：Network First (網絡優先) 混合 Cache Fallback (緩存備用)
    // 確保只要有網絡，客人都會盡量拎到最新檔案；斷網時先用 Cache
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
