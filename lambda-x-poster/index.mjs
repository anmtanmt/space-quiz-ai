import { TwitterApi } from 'twitter-api-v2';

const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const client = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

async function pingSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('ℹ️ Supabase credentials not set, skipping Keep-Alive ping.');
    return;
  }
  try {
    console.log('📡 Supabase Keep-Alive ping 送信中 (PostgreSQL DB書き込みトランザクション)...');
    // NOTE: 空のSELECTだとSupabaseのInactivity Monitorで実アクティビティとしてカウントされずに休止される恐れがあるため、
    // _keep_alive テーブルのタイムスタンプをPATCHで確実に更新（PostgreSQL Write/WAL生成）します。
    const nowIso = new Date().toISOString();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/_keep_alive?id=eq.1`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ last_ping_at: nowIso })
    });

    if (res.ok) {
      console.log(`✅ Supabase Keep-Alive ping 完了 (Status: ${res.status}, DB書き込み成功)`);
    } else {
      console.warn(`⚠️ Supabase Keep-Alive PATCH 失敗 (Status: ${res.status}), SELECT フォールバック試行...`);
      await fetch(`${SUPABASE_URL}/rest/v1/_keep_alive?select=*`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        signal: AbortSignal.timeout(5000)
      });
    }
  } catch (err) {
    console.warn('⚠️ Supabase Keep-Alive ping 失敗 (クイズ投稿は継続します):', err.message);
  }
}

// Gemini API (v1beta, JSON mode) を呼び出す共通ヘルパー
async function callGeminiJson(models, prompt, label = 'Gemini', deadlineMs = Infinity, timeoutMs = 10000) {
  for (const model of models) {
    const remaining = deadlineMs - Date.now();
    if (remaining < 3000) {
      console.warn(`[${label}] 全体デッドライン接近のため打ち切り (残り ${remaining}ms)`);
      return null;
    }

    try {
      console.log(`[${label}] API試行 (モデル: ${model})...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(Math.min(timeoutMs, remaining - 500)),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generation_config: {
            response_mime_type: 'application/json'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[${label} / ${model}] HTTP ${response.status}: ${errorText.substring(0, 120)}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleanJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleanJson);
      return { parsed, model };
    } catch (err) {
      console.warn(`[${label} / ${model}] 試行失敗:`, err.message);
    }
  }
  return null;
}

// 選択肢の順序をランダムにシャッフルし、①②③の番号を付け直す
function shuffleChoicesWithNumbers(quiz) {
  const prefixes = ['① ', '② ', '③ '];
  const stripped = quiz.choices.map((c, idx) => ({
    text: String(c).replace(/^[①②③123１２３][.\s．、　]*/, '').trim(),
    isCorrect: idx === quiz.answerIndex
  }));

  for (let i = stripped.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stripped[i], stripped[j]] = [stripped[j], stripped[i]];
  }

  return {
    ...quiz,
    choices: stripped.map((item, idx) => `${prefixes[idx]}${item.text}`),
    answerIndex: stripped.findIndex(item => item.isCorrect)
  };
}

// 2段階ファクトチェック：正解と解説を隠した状態で別モデルに問題を解かせ、科学的正しさと一意性を検証
async function verifyQuizWithAI(quiz, deadlineMs = Infinity) {
  const verifierModels = ['gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-3.5-flash-lite'];
  const verifyPrompt = `
あなたは天文学の専門家であり、クイズの厳格な校閲者（ファクトチェッカー）です。
以下の3択クイズについて、科学的な正確性と選択肢の妥当性を厳しく検証してください。

【検証対象クイズ】
問題文: ${quiz.question}
選択肢:
0: ${quiz.choices[0]}
1: ${quiz.choices[1]}
2: ${quiz.choices[2]}

【厳格なチェック基準】
1. 問題文の前提が天文学・理科の事実として正確か。
2. 3つの選択肢の中に、科学的に正しい「唯一の正解」が厳密に1つだけ存在するか。
   - 正解が選択肢の中に無い場合は絶対に isValid: false にすること。
   - 複数の選択肢が正解になり得る、または曖昧で誤解を招く場合も isValid: false にすること。
3. よくある誤概念の混同がないか（例：「月の満ち欠け＝地球の影」は誤りで月食との混同、「夏と冬の原因＝太陽との距離」は誤りで地軸の傾き、等）。
4. 数値・距離・時間など文献によって幅や諸説があるテーマの場合、ダミー選択肢が正解の許容範囲と近すぎて議論の余地を生まないか（ダミーは大きく離れた値になっているか）。

【出力JSONフォーマット】
{
  "isValid": true または false,
  "solvedIndex": あなたが導き出した正解の番号（0, 1, 2 のいずれか。正解が存在しない場合は -1）,
  "reason": "判定理由と科学的根拠（50文字以内）"
}
`;

  const result = await callGeminiJson(verifierModels, verifyPrompt, 'FactCheck', deadlineMs);
  if (!result || !result.parsed) {
    return { passed: false, reason: '検証APIの応答取得に失敗' };
  }

  const v = result.parsed;
  if (v.isValid !== true) {
    return { passed: false, reason: `検証AIがNG判定: ${v.reason}` };
  }
  if (typeof v.solvedIndex !== 'number' || v.solvedIndex !== quiz.answerIndex) {
    return {
      passed: false,
      reason: `正解不一致 (生成側: ${quiz.answerIndex}, 検証側: ${v.solvedIndex}) / 理由: ${v.reason}`
    };
  }

  console.log(`✅ ファクトチェック合格 (${result.model}): ${v.reason}`);
  return { passed: true, reason: v.reason };
}

export async function generateQuiz() {
  const topics = [
    '第1章：月と地球（月の直径比1/4、新幹線で約53日、月面に降り立った12人、重力1/6、満ち欠け周期30日、夕方の西の空の三日月など）',
    '第2章：太陽と地球（自転で真南に戻る24時間、冬至に部屋の奥まで届く日差し、太陽表面温度6000℃・黒点4500℃、皆既日食のコロナ、日食・月食の天体配置など）',
    '第3章：地球の仲間たち（惑星はまたたかない・星座を動く、内惑星の満ち欠け、水星が最小・海王星が最遠、8月ペルセウス座流星群、土星の環など）',
    '第4章：夜空は星のキャンバス（動かない2等星・北極星、春の大曲線・スピカ、夏の大三角・デネブ、秋の四辺形・アンドロメダ座、冬の大三角・ベテルギウスなど）',
    '第5章：星と銀河の世界（太陽の900倍の超巨星ベテルギウス、星の色と表面温度（青い星は高温・赤い星は低温）、散開星団すばる、オリオン大星雲、天の川銀河など）',
    '第6章：気軽にスターウォッチング（観察の7つ道具・懐中電灯に赤セロファン、暗闇に目を慣らす15分、月や惑星が載っていない星座早見盤など）'
  ];

  const promptTemplate = (topic) => `
あなたは宇宙知育Webアプリ「宇宙クイズ-AI」の公式アンバサダーAIです。
X（旧Twitter）で毎朝配信する、【天文宇宙検定4級（星空博士）】レベルのオリジナル宇宙クイズを1問作成してください。

【テーマ】
${topic}

【作成手順と厳守事項（ハルシネーション絶対防止）】
1. まず最初に、出題する天文学の正しい科学的根拠（fact_basis）を自分の頭の中で整理し、JSONの最初に出力してください。
2. 特定のテキストや問題集の文章をそのままコピー（丸写し）せず、テーマのエッセンスを活かしたオリジナルの問いかけを作成してください。
3. よくある誤解・混同を絶対に正解にしないでください：
   - 月の満ち欠けの理由は「地球の影（それは月食）」ではなく、「月の公転によって、太陽に照らされた面を地球から見る角度が変わるから」です。
   - 季節の変化の理由は「太陽との距離」ではなく、「地球の地軸の傾き」です。
   - 流れ星の正体は「星が落ちる」のではなく、「宇宙の塵が大気と衝突して光る現象」です。
4. 選択肢は必ず3つ。科学的に正しい唯一の正解が1つだけあり、残り2つは明確に誤りであるように作ってください。
   - 数値・距離・時間の目安など幅や諸説があるテーマを扱う場合は、断定的な聞き方を避けて「最も近いものはどれ？」「目安として最も近いのは？」のように問いかけ、ダミー選択肢は正解の許容範囲と大きく離れた値にしてください（例：正解が15〜30分程度ならダミーは「約10秒」「約3時間」など）。
   - 解説文でも「およそ〜とされています」「〜ほどが目安です」のように自然な表現を用い、「（個人差あり）」のような不自然な注釈・逃げ口上は書かないでください。
5. Xの文字数制限があるため、以下を目安にしてください：
   - 問題文：45文字以内
   - 選択肢：各22文字以内（無理に削って意味が不正確にならないよう注意）
   - 解説：60〜75文字
6. 以下のJSONフォーマットのみで出力してください。

{
  "fact_basis": "この問題で扱う天文学の正確な事実と根拠（解説と選択肢が矛盾しないように先に確定させる）",
  "question": "短く魅力的な問題文",
  "choices": ["選択肢A", "選択肢B", "選択肢C"],
  "answerIndex": 0,
  "explanation": "60〜75文字の短い解説"
}
`;

  const fallbackQuizzes = [
    {
      question: "太陽系の中で一番大きく、きれいなしま模様と「大赤斑」という巨大な嵐がある惑星はどれ？🪐",
      choices: ["① 木星", "② 火星", "③ 金星"],
      answerIndex: 0,
      explanation: "木星は地球が約1300個も入る巨大ガス惑星！表面のしま模様や目玉のような大赤斑は数百年も続く大嵐です。"
    },
    {
      question: "月はどうして夜空で黄色や白く光って見えるのでしょう？🌙",
      choices: ["① 太陽の光を反射しているから", "② 自分で燃えて光っているから", "③ 地球の街明かりが届いているから"],
      answerIndex: 0,
      explanation: "月は自分自身で燃えているのではなく、鏡のように太陽の強い光を跳ね返してピカピカ輝いています。"
    },
    {
      question: "小惑星「リュウグウ」まで旅をして、砂や石を持ち帰ることに成功した日本の有名な宇宙探査機はどれ？🛰️",
      choices: ["① はやぶさ2", "② H3ロケット", "③ SLIM"],
      answerIndex: 0,
      explanation: "はやぶさ2は約52億kmもの長い宇宙の旅をして、太陽系や生命の起源を探る貴重な小惑星のサンプルを持ち帰りました！"
    },
    {
      question: "夜空で方角を知る目印になる「北極星」は、どの星座にある星でしょう？⭐",
      choices: ["① こぐま座", "② オリオン座", "③ はくちょう座"],
      answerIndex: 0,
      explanation: "北極星は「こぐま座」のしっぽの先にあり、地球の地軸のほぼ延長線上にあるため一年中ほとんど動かない星です。"
    },
    {
      question: "太陽系の中で、密度が水よりも軽く「もし巨大なプールがあれば水に浮く」と言われる惑星は？🪐",
      choices: ["① 土星", "② 天王星", "③ 水星"],
      answerIndex: 0,
      explanation: "美しい輪をもつ土星は主に水素やヘリウムのガスでできており、比重が約0.69と水（比重1）より軽いユニークな星です！"
    }
  ];

  const generatorModels = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'];
  const maxAttempts = 3;
  const deadlineMs = Date.now() + 40000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (Date.now() >= deadlineMs) {
      console.warn('⚠️ 全体デッドライン(40秒)に到達したため、生成ループを終了します。');
      break;
    }
    const chosenTopic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`\n--- クイズ生成サイクル (${attempt}/${maxAttempts}回目) ---`);

    const genResult = await callGeminiJson(generatorModels, promptTemplate(chosenTopic), 'Generator', deadlineMs);
    if (!genResult || !genResult.parsed) {
      continue;
    }

    const parsed = genResult.parsed;
    if (
      !parsed.question ||
      !Array.isArray(parsed.choices) ||
      parsed.choices.length !== 3 ||
      typeof parsed.answerIndex !== 'number' ||
      parsed.answerIndex < 0 ||
      parsed.answerIndex > 2 ||
      !parsed.explanation
    ) {
      console.warn('⚠️ 生成JSONの形式が不正のためスキップします:', parsed);
      continue;
    }

    // 選択肢の重複チェック
    if (new Set(parsed.choices).size !== 3) {
      console.warn('⚠️ 選択肢に重複があるためスキップします');
      continue;
    }

    // 選択肢をシャッフルして ①②③ を付与
    const normalizedQuiz = shuffleChoicesWithNumbers(parsed);

    // 2段階目：正解・解説を隠したブラインド検証
    const verification = await verifyQuizWithAI(normalizedQuiz, deadlineMs);
    if (verification.passed) {
      console.log(`🎉 [${genResult.model}] 生成＋ブラインド検証を完全パスしました！`);
      return normalizedQuiz;
    } else {
      console.warn(`❌ ファクトチェック不合格（破棄して再生成）: ${verification.reason}`);
    }

    if (attempt < maxAttempts && deadlineMs - Date.now() > 4000) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.warn('⚠️ 生成または検証に連続失敗したため、安全のため検証済みフォールバッククイズを使用します。');
  return shuffleChoicesWithNumbers(fallbackQuizzes[Math.floor(Math.random() * fallbackQuizzes.length)]);
}

function getTwitterWeight(text) {
  let weight = 0;
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code <= 0x7f) {
      weight += 1;
    } else {
      weight += 2;
    }
  }
  return weight;
}

export const handler = async (event) => {
  console.log('🚀 天文宇宙検定4級 Xクイズ定期配信 Lambda 起動');
  try {
    // 毎日Supabaseの無料枠自動休止を防止するためのKeep-Alive ping
    await pingSupabase();

    const quiz = await generateQuiz();
    const correctAnswerText = quiz.choices[quiz.answerIndex];

    let header = '🎓 今日の天文宇宙検定4級クイズ！🪐\n\n';
    let questionText = `Q. ${quiz.question}\n\n`;
    let choicesText = `${quiz.choices.join('\n')}\n\n`;
    let ctaText = '正解とワクワク解説はリプ欄へ！👇✨\n\n';
    let tags = ['#天文宇宙検定4級', '#天文宇宙検定', '#宇宙クイズ', '#宇宙', '#星空博士'];

    // 1ツイート目の文字数ウェイト（最大280pt、目標270pt以下）調整
    // ※ #天文宇宙検定4級 と #天文宇宙検定 は絶対に削らない
    let tweet1Text = `${header}${questionText}${choicesText}${ctaText}${tags.join(' ')}`;
    while (getTwitterWeight(tweet1Text) > 270 && tags.length > 2) {
      tags.pop(); // タグを後ろから減らす（#星空博士, #宇宙, #宇宙クイズ の順）
      tweet1Text = `${header}${questionText}${choicesText}${ctaText}${tags.join(' ')}`;
    }

    // それでも万が一超える場合は問題文をトリミング
    if (getTwitterWeight(tweet1Text) > 270) {
      const trimDiff = Math.ceil((getTwitterWeight(tweet1Text) - 270) / 2);
      quiz.question = quiz.question.substring(0, Math.max(10, quiz.question.length - trimDiff - 3)) + '...';
      questionText = `Q. ${quiz.question}\n\n`;
      tweet1Text = `${header}${questionText}${choicesText}${ctaText}${tags.join(' ')}`;
    }

    console.log(`1ツイート目 (Weight: ${getTwitterWeight(tweet1Text)}/280):\n${tweet1Text}`);

    // 2ツイート目
    let explanation = quiz.explanation;
    if (explanation.length > 70) {
      explanation = explanation.substring(0, 67) + '...';
    }
    let tweet2Text = `正解は… 【 ${correctAnswerText} 】でした！🎉\n\n📖 解説：\n${explanation}\n\n検定対策やクイズはプロフのリンクから遊べるよ！🚀`;

    console.log(`2ツイート目 (Weight: ${getTwitterWeight(tweet2Text)}/280):\n${tweet2Text}`);

    // 1ツイート目投稿
    console.log('🐦 1ツイート目を投稿中...');
    const post1 = await client.v2.tweet(tweet1Text);
    console.log(`✅ 1ツイート目投稿完了 (ID: ${post1.data.id})`);

    // 2ツイート目（ツリー返信）投稿
    console.log('🐦 2ツイート目（リプ）を投稿中...');
    const post2 = await client.v2.tweet({
      text: tweet2Text,
      reply: { in_reply_to_tweet_id: post1.data.id }
    });
    console.log(`✅ 2ツイート目投稿完了 (ID: ${post2.data.id})`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully posted daily grade 4 quiz',
        tweet1Id: post1.data.id,
        tweet2Id: post2.data.id
      })
    };
  } catch (error) {
    console.error('❌ 配信失敗:', error);
    if (error.data) {
      console.error('X API Error Data:', JSON.stringify(error.data, null, 2));
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.data || null
      })
    };
  }
};
