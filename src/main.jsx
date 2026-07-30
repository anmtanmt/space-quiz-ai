import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// サービスワーカーの登録と全自動更新（Auto-Update）設定
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // updateViaCache: 'none' により sw.js 自体のブラウザキャッシュをバイパス
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then(reg => {
        console.log('Service Worker registered with scope: ', reg.scope);

        // 起動・アクセス時に即座に更新チェック
        reg.update();

        // 待機中の新しいサービスワーカーがあればスキップ要求
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // 新しいSWが見つかった場合の処理
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
      })
      .catch(err => console.error('Service Worker registration failed: ', err));

    // 新しいSWがページコントロールを開始した瞬間、全自動で画面をリロード！
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('New Service Worker active. Auto-refreshing window...');
        window.location.reload();
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
