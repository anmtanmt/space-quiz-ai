import { TwitterApi } from 'twitter-api-v2';

const X_API_KEY = process.env.X_API_KEY;
const X_API_SECRET = process.env.X_API_SECRET;
const X_ACCESS_TOKEN = process.env.X_ACCESS_TOKEN;
const X_ACCESS_SECRET = process.env.X_ACCESS_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new TwitterApi({
  appKey: X_API_KEY,
  appSecret: X_API_SECRET,
  accessToken: X_ACCESS_TOKEN,
  accessSecret: X_ACCESS_SECRET,
});

async function generateQuiz(isToddler) {
  let prompt = '';
  
  if (isToddler) {
    // 🐣 幼児・未就学児向け（ひらがな・カタカナのみ、漢字完全禁止）
    const toddlerTopics = [
      'たいよう（おひさまの ひみつ、あかるいひかり）',
      'おつきさま（まんまるお月さま、うさぎの かげ、夜の おそら）',
      'ほしと おそら（キラキラひかる おほしさま、あまのがわ）',
      'ちきゅう（青くてきれいな ぼくたちの ほし）',
      'ろけっと と うちゅうひこうし（宇宙にとびだす ロケット、かっこいい うちゅうふく）'
    ];
    const chosenTopic = toddlerTopics[Math.floor(Math.random() * toddlerTopics.length)];

    prompt = `
あなたは宇宙知育Webアプリ「宇宙クイズ-AI」の公式アンバサダーAIです。
Twitter/Xで配信する、未就学児（4〜6歳・幼児）がおうちの人と一緒に楽しめる、とてもやさしい宇宙クイズを1問作成してください。

【テーマ】
${chosenTopic}

【最重要ルール】
- 漢字は一切使用禁止です！必ずすべて「ひらがな」と「カタカナ」のみで出力してください。
- 4〜6歳の子どもが直感的にイメージでき、ワクワクする内容にしてください。
- 選択肢は必ず3つ。正解は1つ（ひらがな・カタカナ表記）。
- Xの140文字制限があるため、かいせつ(explanation)は必ず【50文字〜75文字程度】で、やさしく驚きのある文章にしてください。
- 以下のJSONフォーマットのみで出力してください（Markdownコードブロック不可）：

{
  "question": "ひらがなのもんだいぶん（例: おひるの おそらで ピカピカ ひかっている まんまるな おほしさまは なーんだ？☀️）",
  "choices": ["① ひらがなせんたくし1", "② ひらがなせんたくし2", "③ ひらがなせんたくし3"],
  "answerIndex": 0,
  "explanation": "50〜75もじの ひらがなかいせつ"
}
`;
  } else {
    // 🚀 小学生向け（漢字あり・天文宇宙検定4級/3級対応）
    const elementaryTopics = [
      '太陽系の惑星のひみつ（水星・金星・火星・木星・土星・天王星・海王星）',
      '月と地球の不思議（潮の満ち引き、月の満ち欠け、月の裏側、クレーター）',
      '日本の宇宙探査機やロケット（はやぶさ2、SLIM、H3ロケット、ISSと宇宙飛行士）',
      '星と星座の豆知識（一等星、天の川、ブラックホール、太陽の寿命）',
      '天文宇宙検定4級（星博士ジュニア）・3級（星博士）に出題されるような面白い天文学の基礎知識'
    ];
    const chosenTopic = elementaryTopics[Math.floor(Math.random() * elementaryTopics.length)];

    prompt = `
あなたは宇宙知育Webアプリ「宇宙クイズ-AI」の公式アンバサダーAIです。
Twitter/Xで毎朝配信する、小学生（低学年〜中学年）と親御さんが一緒に楽しめる宇宙クイズを1問作成してください。天文宇宙検定4級・3級の対策にもなる良問を期待します。

【テーマ】
${chosenTopic}

【条件】
1. 小学生向け。大人も「へぇ！」となるような面白い事実を題材にしてください。
2. 選択肢は必ず3つ。正解は1つ。
3. Xの140文字制限があるため、解説(explanation)は必ず【60文字〜80文字程度】で短くワクワクする豆知識にしてください。
4. 以下のJSONフォーマットのみで出力してください。Markdownコードブロックなどは付けないでください。

{
  "question": "問題文（短く魅力的に）",
  "choices": ["① 選択肢1", "② 選択肢2", "③ 選択肢3"],
  "answerIndex": 0,
  "explanation": "60〜80文字の短い解説"
}
`;
  }

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
  const cleanJson = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
  return JSON.parse(cleanJson);
}

export const handler = async (event) => {
  console.log('🚀 X宇宙クイズ定期配信 Lambda 起動');
  try {
    // 日本時間（JST = UTC+9）の曜日を取得
    const jstDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const dayOfWeek = jstDate.getUTCDay(); // 0:日, 1:月, 2:火, 3:水, 4:木, 5:金, 6:土

    // 水曜日(3) と 日曜日(0) は「🐣 幼児・未就学児向け（ひらがな版）」！
    // その他の曜日は「🚀 小学生向け（漢字・天文宇宙検定対応）」
    const isToddler = dayOfWeek === 0 || dayOfWeek === 3;
    console.log(`配信対象: ${isToddler ? '🐣 幼児向け（ひらがな版）' : '🚀 小学生向け（漢字版）'} (JST 曜日コード: ${dayOfWeek})`);

    const quiz = await generateQuiz(isToddler);
    const correctAnswerText = quiz.choices[quiz.answerIndex];

    let tweet1Text = '';
    let tweet2Text = '';

    if (isToddler) {
      // 🐣 幼児向け投稿文
      tweet1Text = `🐣 今日の宇宙クイズ！（幼児・未就学児向け）🪐\n\nQ. ${quiz.question}\n\n${quiz.choices.join('\n')}\n\nせいかいと ワクワクかいせつは リプらんへ！👇✨\n\n#未就学児向け #幼児向け #宇宙クイズ #天文宇宙検定 #知育`;

      let explanation = quiz.explanation;
      if (explanation.length > 70) {
        explanation = explanation.substring(0, 67) + '...';
      }
      tweet2Text = `せいかいは… 【 ${correctAnswerText} 】でした！🎉\n\n📖 かいせつ：\n${explanation}\n\nアプリはプロフのリンクからあそべるよ！🚀`;
    } else {
      // 🚀 小学生向け投稿文
      tweet1Text = `🚀 今日の宇宙クイズ！（小学生向け）🪐\n\nQ. ${quiz.question}\n\n${quiz.choices.join('\n')}\n\n正解とワクワク解説はリプ欄へ！👇✨\n\n#小学生向け #宇宙クイズ #宇宙 #天文宇宙検定 #知育`;

      let explanation = quiz.explanation;
      if (explanation.length > 70) {
        explanation = explanation.substring(0, 67) + '...';
      }
      tweet2Text = `正解は… 【 ${correctAnswerText} 】でした！🎉\n\n📖 解説：\n${explanation}\n\nアプリはプロフのリンクから遊べるよ！🚀`;
    }

    // 1ツイート目
    const post1 = await client.v2.tweet(tweet1Text);
    console.log(`✅ 1ツイート目投稿完了 (ID: ${post1.data.id})`);

    // 2ツイート目（ツリー返信）
    const post2 = await client.v2.tweet({
      text: tweet2Text,
      reply: { in_reply_to_tweet_id: post1.data.id }
    });
    console.log(`✅ 2ツイート目投稿完了 (ID: ${post2.data.id})`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully posted daily quiz',
        isToddler,
        tweet1Id: post1.data.id,
        tweet2Id: post2.data.id
      })
    };
  } catch (error) {
    console.error('❌ 配信失敗:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
