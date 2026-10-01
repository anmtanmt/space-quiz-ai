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

async function generateQuiz(isToddler) {
  let prompt = '';
  
  if (isToddler) {
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

  const fallbackToddlerQuizzes = [
    {
      question: "おひるの おそらで ピカピカ あかるく ひかっている まんまるな おほしさまは なーんだ？☀️",
      choices: ["① たいよう", "② おつきさま", "③ ちきゅう"],
      answerIndex: 0,
      explanation: "たいようは とても あつくて まるい ほしなんだよ。ちきゅうを いつも あたたかく てらしてくれているんだ！"
    },
    {
      question: "よるの おそらに うかぶ、かたちが まるくなったり ほそくなったりする おほしさまは なーんだ？🌙",
      choices: ["① おつきさま", "② ひこうき", "③ ろけっと"],
      answerIndex: 0,
      explanation: "おつきさまは たいようの ひかりを あびて ピカピカ ひかっているよ。ひによって かたちが かわって みえるんだ！"
    },
    {
      question: "ぼくたち 人間や どうぶつ、たくさんの 海や 森がある 青くてきれいな ほしの なまえは？🌍",
      choices: ["① かせい", "② ちきゅう", "③ もくせい"],
      answerIndex: 1,
      explanation: "ぼくたちが くらしている ほしは「ちきゅう」というよ。うちゅうから みると、青い海が キラキラ ひかって とっても きれいなんだ！"
    }
  ];

  const fallbackElementaryQuizzes = [
    {
      question: "太陽系の中で一番大きく、きれいなしま模様と「大赤斑」という巨大な嵐がある惑星はどれでしょう？🪐",
      choices: ["① 木星", "② 火星", "③ 金星"],
      answerIndex: 0,
      explanation: "木星は地球が約1300個も入るほどの巨大ガス惑星！表面のしま模様や目玉のような大赤斑は数百年も続く大嵐です。"
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
      explanation: "はやぶさ2は約52億kmもの長い宇宙の旅をして、太陽系や地球の水の起源を探る貴重な小惑星のサンプルを持ち帰りました！"
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
  const pool = isToddler ? fallbackToddlerQuizzes : fallbackElementaryQuizzes;
  return pool[Math.floor(Math.random() * pool.length)];
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

    const jstDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const dayOfWeek = jstDate.getUTCDay();
    const isToddler = dayOfWeek === 0 || dayOfWeek === 3;

    console.log(`🤖 クイズ生成中... 対象: ${isToddler ? '🐣 幼児向け（ひらがな版）' : '🚀 小学生向け（漢字版）'}`);
    const quiz = await generateQuiz(isToddler);

    const correctAnswerText = quiz.choices[quiz.answerIndex];

    let header = isToddler ? '🐣 今日の宇宙クイズ！（幼児向け）🪐\n\n' : '🚀 今日の宇宙クイズ！（小学生向け）🪐\n\n';
    let questionText = `Q. ${quiz.question}\n\n`;
    let choicesText = `${quiz.choices.join('\n')}\n\n`;
    let ctaText = isToddler ? 'せいかいと ワクワクかいせつは リプらんへ！👇✨\n\n' : '正解とワクワク解説はリプ欄へ！👇✨\n\n';
    let tags = isToddler 
      ? ['#未就学児向け', '#幼児向け', '#宇宙クイズ', '#天文宇宙検定', '#知育']
      : ['#小学生向け', '#宇宙クイズ', '#宇宙', '#天文宇宙検定', '#知育'];

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
    let tweet2Text = isToddler
      ? `せいかいは… 【 ${correctAnswerText} 】でした！🎉\n\n📖 かいせつ：\n${explanation}\n\nアプリはプロフのリンクからあそべるよ！🚀`
      : `正解は… 【 ${correctAnswerText} 】でした！🎉\n\n📖 解説：\n${explanation}\n\nアプリはプロフのリンクから遊べるよ！🚀`;

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
