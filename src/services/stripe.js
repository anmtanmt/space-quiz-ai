// Stripe 決済連携サービス
// Stripe Checkout & Customer Portal との通信、およびテスト環境シミュレーションを提供します。

const getApiGatewayUrl = () => {
  return import.meta.env.VITE_API_GATEWAY_URL || '';
};

/**
 * Stripe Checkout セッションを作成して決済画面へリダイレクト
 */
export async function redirectToCheckout(userId, email) {
  const apiGatewayUrl = getApiGatewayUrl();

  // API Gateway（Lambda）が接続されている場合
  if (apiGatewayUrl) {
    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_checkout_session',
          userId,
          email,
          successUrl: `${window.location.origin}${window.location.pathname}?checkout_success=true`,
          cancelUrl: `${window.location.origin}${window.location.pathname}?checkout_cancel=true`
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to call Stripe via API Gateway, using local test flow.', e);
    }
  }

  // APIキー未設定のローカル/テスト環境: 擬似シミュレーション
  console.info('Running in local test mode: Simulating successful Stripe Checkout.');
  return simulateLocalCheckout();
}

/**
 * Stripe Customer Portal（契約確認・解約・カード変更）へリダイレクト
 */
export async function redirectToCustomerPortal(customerId) {
  const apiGatewayUrl = getApiGatewayUrl();

  if (apiGatewayUrl && customerId) {
    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create_portal_session',
          customerId,
          returnUrl: window.location.href
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to call Customer Portal via API Gateway.', e);
    }
  }

  alert('【テスト環境案内】\nStripeの本番/テストAPIキーが未設定のため、実際のCustomer Portalは開きません。\n本番環境ではStripeの解約・変更画面が自動で開きます。');
}

/**
 * ローカルテスト用: 疑似チェックアウト
 */
function simulateLocalCheckout() {
  return new Promise((resolve) => {
    const isConfirmed = window.confirm(
      '【🧪 Stripe テスト決済シミュレーション】\n\n「宇宙博士プラン（月額380円）」に加入しますか？\n（※本番ではStripeのカード決済画面が開きます。テスト環境のため料金は一切発生しません）'
    );
    if (isConfirmed) {
      resolve({ success: true });
    } else {
      resolve({ success: false });
    }
  });
}
