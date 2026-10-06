import { TwitterApi } from 'twitter-api-v2';

const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET || !GEMINI_API_KEY) {
  console.error('必要な環境変数が設定されていません。');
  process.exit(1);
}

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
    console.log('📡 Supabase Keep-Alive ping 送信中...');
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY
      }
    });
    console.log(`✅ Supabase Keep-Alive ping 完了 (Status: ${res.status})`);
  } catch (err) {
    console.warn('⚠️ Supabase Keep-Alive ping 失敗 (クイズ投稿は継続します):', err.message);
  }
}

async function generateQuiz() {
  const topics = [
    '太陽と太陽系の惑星（水星・金星・地球・火星・木星・土星・天王星・海王星の特徴）',
    '月と地球の秘密（満ち欠け、月の裏側、クレーター、潮の満ち引き）',
    '夜空の星と星座（夏の大三角、オリオン座、北極星、一等星、天の川の正体）',
    '宇宙探査機とロケット（はやぶさ2、月探査機SLIM、H3ロケット、国際宇宙ステーション）',
    '太陽と星の一生（太陽の温度や黒点、恒星の光り方、超新星爆発）',
    '天文宇宙検定4級（星博士ジュニア）によく出る、身近で面白い宇宙の基礎知識'
  ];
  const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `
あなたは宇宙知育Webアプリ「宇宙クイズ-AI」の公式アンバサダーAIです。
Twitter/Xで毎朝配信する、【天文宇宙検定4級（星博士ジュニア）】の対策になる良問の宇宙クイズを1問作成してください。

【テーマ】
${chosenTopic}

【条件】
1. 天文宇宙検定4級（小学生〜一般向け）レベル。大人も思わず「へぇ！」となるような面白い天文学の事実を題材にしてください。
2. 選択肢は必ず3つ。正解は1つ。
3. Xの文字数制限があるため、【問題文は45文字以内】、【選択肢は各15文字以内】、【解説は60〜75文字】を厳守してください。
4. 以下のJSONフォーマットのみで出力してください。Markdownコードブロックなどは付けないでください。

{
  "question": "短く魅力的な問題文",
  "choices": ["① 選択肢1", "② 選択肢2", "③ 選択肢3"],
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

  const models = ['gemini-2.5-flash-lite', 'gemini-3.1-flash-lite'];
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    for (const model of models) {
      try {
        console.log(`Gemini API試行 (${attempt}回目 / モデル: ${model})...`);
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[${model}] HTTP ${response.status}: ${errorText.substring(0, 100)}`);
          continue;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const cleanJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
        const parsed = JSON.parse(cleanJson);

        if (parsed.question && Array.isArray(parsed.choices) && parsed.choices.length === 3 && parsed.explanation) {
          console.log(`✅ Gemini (${model}) でのクイズ生成に成功！`);
          return parsed;
        }
      } catch (err) {
        console.warn(`[${model}] 試行失敗:`, err.message);
      }
    }

    if (attempt < maxAttempts) {
      const waitMs = attempt * 1500;
      console.log(`再試行まで ${waitMs}ms 待機します...`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }

  console.warn('⚠️ Gemini APIが全て応答しなかったため、厳選フォールバッククイズを使用します。');
  return fallbackQuizzes[Math.floor(Math.random() * fallbackQuizzes.length)];
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

async function main() {
  try {
    await pingSupabase();

    console.log('🤖 天文宇宙検定4級 クイズ生成中...');
    const quiz = await generateQuiz();

    const correctAnswerText = quiz.choices[quiz.answerIndex];

    let header = '🎓 今日の天文宇宙検定4級クイズ！🪐\n\n';
    let questionText = `Q. ${quiz.question}\n\n`;
    let choicesText = `${quiz.choices.join('\n')}\n\n`;
    let ctaText = '正解とワクワク解説はリプ欄へ！👇✨\n\n';
    let tags = ['#天文宇宙検定4級', '#天文宇宙検定', '#宇宙クイズ', '#宇宙', '#星空博士'];

    let tweet1Text = `${header}${questionText}${choicesText}${ctaText}${tags.join(' ')}`;
    while (getTwitterWeight(tweet1Text) > 270 && tags.length > 2) {
      tags.pop();
      tweet1Text = `${header}${questionText}${choicesText}${ctaText}${tags.join(' ')}`;
    }

    if (getTwitterWeight(tweet1Text) > 270) {
      const trimDiff = Math.ceil((getTwitterWeight(tweet1Text) - 270) / 2);
      quiz.question = quiz.question.substring(0, Math.max(10, quiz.question.length - trimDiff - 3)) + '...';
      questionText = `Q. ${quiz.question}\n\n`;
      tweet1Text = `${header}${questionText}${choicesText}${ctaText}${tags.join(' ')}`;
    }

    let explanation = quiz.explanation;
    if (explanation.length > 70) {
      explanation = explanation.substring(0, 67) + '...';
    }
    let tweet2Text = `正解は… 【 ${correctAnswerText} 】でした！🎉\n\n📖 解説：\n${explanation}\n\n検定対策やクイズはプロフのリンクから遊べるよ！🚀`;

    console.log('\n--- 1ツイート目 --- (Weight: ' + getTwitterWeight(tweet1Text) + '/280)');
    console.log(tweet1Text);
    console.log('\n--- 2ツイート目 --- (Weight: ' + getTwitterWeight(tweet2Text) + '/280)');
    console.log(tweet2Text);

    console.log('\n🐦 X へ投稿中...');
    const post1 = await client.v2.tweet(tweet1Text);
    console.log(`✅ 1ツイート目投稿完了 (ID: ${post1.data.id})`);

    const post2 = await client.v2.tweet({
      text: tweet2Text,
      reply: { in_reply_to_tweet_id: post1.data.id }
    });
    console.log(`✅ 2ツイート目投稿完了 (ID: ${post2.data.id})`);
  } catch (error) {
    console.error('❌ エラー:', error);
    if (error.data) {
      console.error('X API Error Data:', JSON.stringify(error.data, null, 2));
    }
    process.exit(1);
  }
}

main();
