import { TwitterApi } from 'twitter-api-v2';

// 環境変数の取得
const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET || !GEMINI_API_KEY) {
  console.error('必要な環境変数が設定されていません。');
  process.exit(1);
}

// X クライアント初期化
const client = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

// Gemini API を用いたクイズ自動生成
async function generateQuiz() {
  const topics = [
    '太陽系の惑星のひみつ（水星・金星・火星・木星・土星・天王星・海王星）',
    '月と地球の不思議（潮の満ち引き、月の満ち欠け、月の裏側）',
    '日本の宇宙探査機やロケット（はやぶさ2、SLIM、H3ロケット、ISSと宇宙飛行士）',
    '星と星座の豆知識（一等星、天の川、ブラックホール、太陽の寿命）',
    '天文宇宙検定4級（星博士ジュニア）・3級（星博士）に出題されるような面白い天文学の基礎知識'
  ];
  const chosenTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `
あなたは宇宙知育Webアプリ「宇宙クイズ-AI」の公式アンバサダーAIです。
Twitter/Xで毎朝配信する、子どもと親が一緒に楽しめる宇宙クイズを1問作成してください。

【テーマ】
${chosenTopic}

【条件】
1. 小学校低学年〜中学年でも理解でき、大人も「へぇ！」となるような面白い事実を題材にしてください。
2. 選択肢は必ず3つ。正解は1つ。
3. 以下のJSONフォーマットのみで出力してください。Markdownコードブロックなどは付けないでください。

{
  "question": "問題文（例: 太陽系でいちばん風が強い惑星はどこでしょう？🌀）",
  "choices": ["① 選択肢1", "② 選択肢2", "③ 選択肢3"],
  "answerIndex": 0,
  "explanation": "わかりやすい解説（100〜140文字程度。子どもがワクワクする豆知識を入れてください）"
}
`;

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text.trim();
  // JSONブロック記号等があれば除去
  const cleanJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleanJson);
}

async function main() {
  try {
    console.log('🤖 Gemini でクイズを生成中...');
    const quiz = await generateQuiz();
    console.log('生成されたクイズ:', quiz);

    const correctAnswerText = quiz.choices[quiz.answerIndex];

    // 1ツイート目: 問題文（スレッド誘導型）
    const tweet1Text = `🚀 今日の宇宙クイズ！🪐\n\nQ. ${quiz.question}\n\n${quiz.choices.join('\n')}\n\n正解とワクワク解説はリプ欄（ツリー）へ！👇✨\n\n#宇宙クイズ #宇宙 #天文宇宙検定 #知育`;

    console.log('\n--- 1ツイート目 ---');
    console.log(tweet1Text);

    // 2ツイート目: 正解・解説・プロフィールへの導線（※Xの外部URL規制とアルゴリズム対策）
    const tweet2Text = `正解は… 【 ${correctAnswerText} 】でした！🎉\n\n📖 かんたん解説：\n${quiz.explanation}\n\n📱 Webアプリ「宇宙クイズ-AI」なら、AIクイズや天文宇宙検定対策が今すぐ無料で遊べるよ！🚀\n（※アプリはプロフィールのリンクからすぐ遊べます👆✨）`;

    console.log('\n--- 2ツイート目 ---');
    console.log(tweet2Text);

    // X API でツリー投稿
    console.log('\n🐦 X へ投稿中...');
    const post1 = await client.v2.tweet(tweet1Text);
    console.log(`✅ 1ツイート目投稿完了 (ID: ${post1.data.id})`);

    const post2 = await client.v2.tweet({
      text: tweet2Text,
      reply: { in_reply_to_tweet_id: post1.data.id }
    });
    console.log(`✅ 2ツイート目（リプライ）投稿完了 (ID: ${post2.data.id})`);

    console.log('\n🎉 今日の宇宙クイズ配信がすべて完了しました！');
  } catch (error) {
    console.error('❌ 投稿エラー:', error);
    process.exit(1);
  }
}

main();
