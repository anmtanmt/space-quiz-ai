const CACHE_NAME = 'space-quiz-ai-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/manifest.webmanifest'
];

// インストール時に基本アセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache and caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// リクエスト時のフェッチ処理 (Stale-While-Revalidate戦略)
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // ローカル開発環境 (localhost / 127.0.0.1) または Vite の開発用 HMR リクエストはキャッシュ対象外
  if (
    requestUrl.hostname === 'localhost' ||
    requestUrl.hostname === '127.0.0.1' ||
    requestUrl.pathname.startsWith('/@vite') ||
    requestUrl.pathname.includes('hot-update')
  ) {
    return; // ネットワークから直接取得
  }

  // POSTリクエストやAPIリクエスト (Lambda, API Gateway) はキャッシュしない
  if (
    event.request.method !== 'GET' ||
    requestUrl.pathname.startsWith('/api') ||
    requestUrl.host.includes('execute-api') || 
    requestUrl.host.includes('generativelanguage.googleapis.com')
  ) {
    return; // ブラウザのデフォルト動作 (ネットワークから取得)
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              // 自ドメインの静的アセットのみキャッシュを更新
              cache.put(event.request, networkResponse.clone());
            } else if (networkResponse && networkResponse.status === 200 && requestUrl.host.includes('fonts.googleapis.com') || requestUrl.host.includes('fonts.gstatic.com')) {
              // Google Fonts などの外部静的アセットもキャッシュ
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            console.log('Fetch failed, returning cached version if available:', err);
          });

        // キャッシュがあれば即座に返し、なければネットワーク取得完了を待つ
        return cachedResponse || fetchPromise;
      });
    })
  );
});
