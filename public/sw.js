const CACHE_NAME = 'space-quiz-ai-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/manifest.webmanifest'
];

// メッセージイベント（メインスレッドからの SKIP_WAITING 要求を即時処理）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// インストール時に基本アセットをキャッシュ＆即座に待機スキップ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache v4 and caching static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// アクティベート時に古いキャッシュを即座に破棄してクライアントを制御
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old SW cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// リクエスト時のフェッチ処理
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  // 1. ローカル開発環境 (localhost / 127.0.0.1) や Vite HMR、API通信はネットワークに直接スルー
  if (
    requestUrl.hostname === 'localhost' ||
    requestUrl.hostname === '127.0.0.1' ||
    requestUrl.pathname.startsWith('/@vite') ||
    requestUrl.pathname.includes('hot-update') ||
    request.method !== 'GET' ||
    requestUrl.pathname.startsWith('/api') ||
    requestUrl.host.includes('execute-api') || 
    requestUrl.host.includes('generativelanguage.googleapis.com')
  ) {
    return;
  }

  // 2. HTMLドキュメント、JavaScript, CSSファイルは Network-First (ネットワーク優先)
  // オンライン時は常に本番サーバーから最新を取得し、取得成功時にキャッシュを更新。オフライン時のみキャッシュを返す！
  const isDocOrCode = 
    request.mode === 'navigate' ||
    request.headers.get('accept')?.includes('text/html') ||
    requestUrl.pathname.endsWith('.js') ||
    requestUrl.pathname.endsWith('.css');

  if (isDocOrCode) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 3. 画像や音声等のメディアアセットは Stale-While-Revalidate 戦略
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
