// Google Analytics 4 (GA4) イベント送信ヘルパー

const GA_MEASUREMENT_ID = 'G-KM88SCVWD6';

/**
 * GA4カスタムイベントを安全に送信する
 * @param {string} eventName - イベント名（例: 'quiz_start', 'quiz_finish', 'view_subscription'）
 * @param {Object} [params] - イベントパラメータ
 */
export function trackEvent(eventName, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    console.debug('[Analytics] Failed to send event:', eventName, err);
  }
}

/**
 * ページビュー送信
 * @param {string} pagePath 
 * @param {string} [pageTitle] 
 */
export function trackPageView(pagePath, pageTitle) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle || document.title,
      });
    }
  } catch (err) {
    console.debug('[Analytics] Failed to track page view:', err);
  }
}
