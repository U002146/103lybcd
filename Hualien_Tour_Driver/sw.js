// v1.0 Service Worker (PWA 斷網不死引擎)
const CACHE_NAME = 'hualien-tour-v1';

// 白名單：宣告系統一運作，就立刻塞入本地端儲存空間的檔案清單
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// 安裝事件：強暴抓取檔案存入底層記憶體
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] 安裝成功，核心檔案寫入死鎖快取');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting(); // 不須等待舊版關閉，強力升級
});

// 啟動事件：負責殺掉舊有廢棄版本的快取
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] 抹除舊世代快取', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // 強制接管目前打開的網頁
});

// 攔截大腦：攔截所有網路請求。即使是斷網或伺服器被炸毀，我們也會從記憶體吐出快取
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 情境 1：記憶體裡面有這個檔案 (如 index.html, style.css)，直接命中返回不囉唆
                if (response) {
                    return response;
                }
                
                // 情境 2：記憶體裡沒有，放行讓他去網路上要資料 (比如 Google Sheets 的 API request)
                return fetch(event.request).catch(err => {
                    console.log('[SW] 徹底斷網狀態，阻斷失敗的 fetch ', err);
                    // 在這個專案裡，如果 GAS fetch 失敗，前端的 localStorage 也有保命機制，所以這裡安靜回傳即可
                });
            })
    );
});
