const SUPABASE_URL = process.env.SUPABASE_URL || 'https://abpzuhjcahmdaesqzuim.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_CMsrX6j1M4b3QJOGQ_Fwkg__oqrSQ_M';

export const handler = async (event) => {
  console.log('📡 Supabase Keep-Alive 定期実行 (PostgreSQL DB書き込みトランザクション)...');
  const nowIso = new Date().toISOString();

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/_keep_alive?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ last_ping_at: nowIso })
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`✅ Supabase Keep-Alive 成功 (Status: ${res.status}):`, data);
      return { statusCode: 200, body: JSON.stringify(data) };
    } else {
      const errorText = await res.text();
      console.warn(`⚠️ Supabase Keep-Alive PATCH 失敗 (Status: ${res.status}):`, errorText);
      return { statusCode: res.status, body: errorText };
    }
  } catch (err) {
    console.error('❌ Supabase Keep-Alive 例外エラー:', err.message);
    throw err;
  }
};
