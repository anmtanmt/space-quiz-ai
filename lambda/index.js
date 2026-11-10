// AWS Lambda 関数 (Node.js 18+)
// Gemini API を直接 HTTPS Fetch で呼び出すことで、追加のライブラリ依存性をゼロにし、
// 超軽量・高速・低コストなサーバーレスAPIを実現します。

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"\s]/g, '') : '';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.replace(/['"\s]/g, '') : '';
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ? process.env.STRIPE_PRICE_ID.replace(/['"\s]/g, '') : '';

exports.handler = async (event) => {
  // CORS レスポンスヘッダーの設定
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
    'Content-Type': 'application/json'
  };

  // OPTIONS (プリフライト) リクエストの処理
  const httpMethod = event.httpMethod || (event.requestContext && event.requestContext.http && event.requestContext.http.method);
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // リクエストボディのパース
    let body = {};
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    }

    // --- Stripe 決済アクションのハンドリング ---
    if (body.action === 'create_checkout_session') {
      if (!STRIPE_SECRET_KEY) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'STRIPE_SECRET_KEY is not configured on AWS Lambda.' })
        };
      }
      const session = await createStripeCheckoutSession(
        body.userId, 
        body.email, 
        body.successUrl, 
        body.cancelUrl, 
        body.planType,
        body.currentPassExpiresAt
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(session)
      };
    }

    if (body.action === 'create_portal_session') {
      if (!STRIPE_SECRET_KEY) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'STRIPE_SECRET_KEY is not configured on AWS Lambda.' })
        };
      }
      const portal = await createStripePortalSession(body.customerId, body.returnUrl);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(portal)
      };
    }

    // --- Gemini クイズ生成処理 ---
    // APIキー未設定エラー
    if (!GEMINI_API_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured on AWS Lambda.' })
      };
    }

    const difficulty = body.difficulty || 'easy';
    const answeredIds = body.answeredIds || [];
    const excludeQuestions = body.excludeQuestions || [];
    const recentQuestions = body.recentQuestions || [];
    const isTest = body.isTest || false;
    const grade = body.grade || '4';
    const targetChapter = body.targetChapter !== undefined ? body.targetChapter : null;
    const targetImage = body.targetImage !== undefined ? body.targetImage : null;

    let quiz;
    if (isTest) {
      // 天文宇宙検定クイズの生成
      quiz = await generateTestQuiz(grade, answeredIds, excludeQuestions, recentQuestions, targetChapter, targetImage);
    } else {
      // 通常の宇宙クイズ生成
      quiz = await generateQuiz(difficulty, answeredIds, excludeQuestions, recentQuestions);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(quiz)
    };
  } catch (error) {
    console.error('Lambda Execution Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate quiz.',
        details: error.message 
      })
    };
  }
};

// Gemini API からクイズを生成し、バリデーションとリトライを行う関数
async function generateQuiz(difficulty, answeredIds, excludeQuestions = [], recentQuestions = []) {
  let difficultyConstraint = '';
  if (difficulty === 'easy') {
    difficultyConstraint = `
    - 難易度: 未就学児（4〜6歳）向け。極めてやさしい宇宙の基礎知識。
    - 表記ルール: 【重要】漢字は一切使用禁止です。漢字はすべて「ひらがな」または「カタカナ」にひらがな化してください。
    - ひらがな・カタカナのみで記述してください。
    `;
  } else if (difficulty === 'medium') {
    difficultyConstraint = `
    - 難易度: 小学校低学年（7〜9歳）向け。宇宙の簡単なクイズ。
    - 表記ルール: 漢字は簡単な小学1〜2年生レベルの漢字のみ許可。ただし、【重要】文中のすべての漢字に対してHTML形式のルビ（ふりがな）を振ること。
    - ルビの書き方例: <ruby>地球<rt>ちきゅう</rt></ruby> のように記述してください。ひらがなやカタカナにルビを振る必要はありません。
    `;
  } else {
    difficultyConstraint = `
    - 難易度: 少し難しめの宇宙の知識（小学生高学年手前レベル）。
    - 表記ルール: 漢字を自由に使用して良いですが、すべての漢字に必ずHTML形式のルビ（ふりがな）を振ること。
    - ルビの書き方例: <ruby>太陽系<rt>たいようけい</rt></ruby> のように記述してください。
    `;
  }

  let exclusionPrompt = '';
  if (excludeQuestions && excludeQuestions.length > 0) {
    const listStr = excludeQuestions.map((q) => `  - ${q}`).join('\n');
    exclusionPrompt += `
    - 【最重要・絶対遵守】以下の「直近の数問」と**「質問の趣旨・テーマ・正解の対象」が絶対に重複しない、全く異なる新しい宇宙のテーマから出題してください**。
    - 直近の数問:
    ${listStr}
    `;
  }

  if (recentQuestions && recentQuestions.length > 0) {
    const listStr = recentQuestions.map((q) => `  - ${q}`).join('\n');
    exclusionPrompt += `
    - 【重要】以下の「最近出題された問題リスト（最大30問）」ともできるだけテーマや題材が重複しないようにしてください。
    - まだ出題されていない幅広い宇宙のトピック（例：別の惑星の特徴、ブラックホール、ロケットの仕組み、宇宙服のひみつ、星座、歴史、宇宙探査機など）から積極的に選んで出題してください。
    - 最近出題された問題リスト:
    ${listStr}
    `;
  }

  const prompt = `
  宇宙に関する3択クイズを1問、JSONフォーマットで生成してください。
  以下のルールを厳密に守ってください。

  ${difficultyConstraint}
  ${exclusionPrompt}

  - 選択肢は必ず3つ。正解は1つ。
  - 回答後の解説(explanation)は、子どもが読んで楽しく理解できる、やさしい表現にしてください。
  - 解説に含まれる漢字にも、上記と同様のルビ（ふりがな）ルールを適用してください（easyの場合は漢字禁止、medium/hardの場合はルビ必須）。

  【出力フォーマット】
  必ず以下のJSONフォーマットのみで出力してください。Markdownのコードブロックなども一切付けないでください。

  {
    "question": "問題文（ルビルール適用）",
    "choices": ["選択肢1（ルビルール適用）", "選択肢2（ルビルール適用）", "選択肢3（ルビルール適用）"],
    "answerIndex": 0,
    "explanation": "子ども向け解説（ルビルール適用）"
  }
  `;

  const candidateModels = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];
  for (let i = 0; i < candidateModels.length; i++) {
    const currentModelName = candidateModels[i];
    try {
      // Node.js 18 以降で標準提供されているグローバル fetch を使用
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${currentModelName}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        let errorDetails = '';
        try {
          errorDetails = await response.text();
        } catch (_) {}
        throw new Error(`Gemini API HTTP error! status: ${response.status}. Details: ${errorDetails}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text.trim();
      const quiz = JSON.parse(text);

      // 自動バリデーション
      if (validateQuiz(quiz, difficulty)) {
        quiz.id = 'ai_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        return quiz;
      }
      console.warn(`Quiz failed validation with ${currentModelName}, trying next...`);
    } catch (e) {
      console.error(`Attempt failed with model ${currentModelName}. Error: ${e.message}`);
    }
  }

  throw new Error('Failed to generate a valid quiz after multiple attempts.');
}

// AIが <rt>かんじ</rt> のように <ruby> を省いて出力した場合に自動補正する
function normalizeRubyTags(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/(?<!<ruby>)([\u4e00-\u9faf]+)<rt>(.*?)<\/rt>(?!<\/ruby>)/g, '<ruby>$1<rt>$2</rt></ruby>');
}

function sanitizeQuizRubies(quiz) {
  if (!quiz) return quiz;
  if (quiz.question) quiz.question = normalizeRubyTags(quiz.question);
  if (Array.isArray(quiz.choices)) {
    quiz.choices = quiz.choices.map(c => normalizeRubyTags(c));
  }
  if (quiz.explanation) quiz.explanation = normalizeRubyTags(quiz.explanation);
  return quiz;
}

// バリデーション関数
function validateQuiz(quiz, difficulty) {
  if (!quiz) return false;
  sanitizeQuizRubies(quiz);
  if (typeof quiz.question !== 'string' || quiz.question.length < 5) return false;
  if (!Array.isArray(quiz.choices) || quiz.choices.length !== 3) return false;
  if (typeof quiz.answerIndex !== 'number' || quiz.answerIndex < 0 || quiz.answerIndex > 2) return false;
  if (typeof quiz.explanation !== 'string' || quiz.explanation.length < 5) return false;

  const uniqueChoices = new Set(quiz.choices);
  if (uniqueChoices.size !== 3) return false;

  if (difficulty === 'easy') {
    const kanjiRegex = /[\u4e00-\u9faf]/;
    if (kanjiRegex.test(quiz.question) || kanjiRegex.test(quiz.explanation) || quiz.choices.some(c => kanjiRegex.test(c))) {
      return false;
    }
  }

  if (difficulty === 'medium' || difficulty === 'hard') {
    const kanjiRegex = /[\u4e00-\u9faf]/;
    const hasKanji = kanjiRegex.test(quiz.question);
    const hasRuby = quiz.question.includes('<ruby>');
    if (hasKanji && !hasRuby) {
      return false;
    }
  }

  return true;
}

// 天文宇宙検定用のクイズ生成（4択）
async function generateTestQuiz(grade, answeredIds, excludeQuestions = [], recentQuestions = [], targetChapter = null, targetImage = null) {
  const syllabus4th = `
  【天文宇宙検定4級（星空博士）の公式テキスト章構成・出題基準】
  - 1章：月と地球
    - 月の直径（地球の約1/4、約3500km）、月までの距離（約38万km、時速300kmの新幹線で約53日）
    - 月の重力（地球の約1/6、体重60kgなら10kg）、アポロ計画で月面に降り立った人数（計12人、アポロ11〜17号）
    - 月の満ち欠け周期（約30日・1ヶ月）、月の見え方（夕方の西の空は三日月、南の空は上弦の月、東の空からは満月）
    - 月のクレーター、自転と公転が同じ周期のため地球にはいつも同じ面を向けていること
  - 2章：太陽と地球
    - 太陽の1日の動きと地球の自転、太陽が真南（南中）から翌日真南に来るまでの時間は24時間（1日）
    - 太陽の1年の動きと地球の公転、季節による南中高度の変化（冬至は太陽が一番低く、日差しが部屋の奥まで届き影が最も長い。夏至は一番高く影が短い）
    - 太陽表面の温度（光球は約6000℃）、黒点の温度（周囲より低く約4500℃）、プロミネンス（紅炎）
    - 皆既日食で見える真珠色に光る希薄な超高温大気（コロナ）
    - 日食の天体配置（地球ー月ー太陽、月は新月）、月食の天体配置（太陽ー地球ー月、月は満月）
  - 3章：地球の仲間たち（太陽系・惑星・流星群）
    - 惑星の見え方の特徴（チカチカまたたかない、星座の間を日々動いていく、肉眼の見た目だけでは遠近はわからない）
    - 内惑星（水星・金星）は月のように満ち欠けし、地球から見て太陽に近いため明け方か夕方にしか見えない
    - 太陽系8惑星の距離順（水金地火木土天海。海王星が最遠。冥王星・エリスは準惑星）
    - 惑星の大きさ順（水星が最小、木星が最大。水星＜火星＜金星＜地球＜海王星＜天王星＜土星＜木星）
    - 主な流星群（8月ペルセウス座流星群、12月ふたご座流星群、1月しぶんぎ座流星群）
    - 木星型惑星（木・土・天・海）の特徴と環、小型望遠鏡でもはっきり環が見える土星
  - 4章：夜空は星のキャンバス（四季の星座）
    - 北極星（ポラリス）：真北の空にあって1年中動かない2等星、昔からの旅の目印
    - 春の星座と春の大曲線：北斗七星の柄→うしかい座アルクトゥルス（麦星）→おとめ座スピカ（真珠星）
    - 夏の星座と夏の大三角：こと座ベガ（織姫）、わし座アルタイル（彦星）、はくちょう座デネブ
    - 秋の星座と秋の四辺形：ペガスス座の3つの星とアンドロメダ座の星（アルフェラッツ）で構成
    - 冬の星座と冬の大三角：おおいぬ座シリウス、こいぬ座プロキオン、オリオン座ベテルギウス（赤色超巨星、平家星。リゲルは源氏星）
  - 5章：星と銀河の世界（恒星・星団・星雲・銀河）
    - 恒星の大きさと超巨星：ベテルギウスの直径は太陽の約900倍（太陽系に置くと木星軌道まで達する）
    - 星の色と表面温度：青白い星（リゲルなど）は1万℃以上の高温、黄色い星（太陽）は約6000℃、赤い星（ベテルギウスなど）は約3000℃の低温
    - 星団の種類：散開星団（すばる/プレアデス星団など、若い星がまばらに数十〜数百個）、球状星団（老いた星が球状に数万〜数百万個）
    - 星雲：オリオン大星雲（M42、三つ星の下にあり肉眼でもぼんやり見える散光星雲、星が生まれる場所）
    - 銀河系と天の川：天の川の正体は、太陽系を含む数千億個の星の集団「銀河系」を内側から見た姿。アンドロメダ銀河（約230万光年、お隣の大型銀河）
  - 6章：気軽にスターウォッチング（天体観察入門）
    - 星空観察の7つ道具：星座早見盤、コンパス、懐中電灯（赤いセロファンを貼る）、上着、時計、レジャーシート、双眼鏡や望遠鏡
    - 暗順応：暗闇で星がよく見えるようになるには目を慣らす時間として「15分〜20分」必要
    - 星座早見盤の性質：年じゅう使えるよう、日々位置が移動する「月」や「惑星」は印刷されていない
    - 星座早見盤の使い方：観察する「月日（外枠）」と「時刻（内枠）」の目盛りをぴったり合わせ、見たい方角を下に持って空にかざす
  `;

  const syllabus3rd = `
  【天文宇宙検定3級のシラバス章構成】
  - 1章：星座や星空の動き（天球、天の赤道、黄道（太陽の通り道）、日周運動と年周運動、四季の星座、一等星、24の星座の歴史など）
  - 2章：太陽と月、地球の運動（太陽の内部構造（コア、輻射層、対流層）や表面の活動（フレア、コロナ、太陽風）、月の潮汐作用や満ち欠け周期、日食・月食のメカニズムなど）
  - 3章：太陽系の世界（各惑星の物理特徴（大気、温度、内部構造）、地球型・木星型惑星の違い、衛星（ガリレオ衛星、タイタンなど）、小惑星、彗星、太陽系外縁天体（冥王星など）など）
  - 4章：ステラ・クロニクル（天文学の歴史）（古代宇宙観、天動説と地動説の対立、ケプラーの法則、ニュートンの万有引力、星座の起源（古代から88星座決定まで）など）
  - 5章：銀河と宇宙の世界（恒星の明るさ（見かけ・絶対等級）、恒星の誕生から一生（超新星、ブラックホール）、天の川銀河の形・大きさ・位置、宇宙膨張、ビッグバン理論など）
  - 6章：宇宙開発と時事問題（H3ロケットやHTV-Xの開発、月探査（アルテミス計画、SLIM）、惑星探査機成果、最新天文学ニュースや望遠鏡の成果など）
  `;

  let gradePrompt = '';
  if (grade === '3') {
    gradePrompt = `天文宇宙検定3級（星空準案内人・一般天文学の基礎）のシラバスや出題傾向に準拠した、やや専門的な天文学の歴史、太陽の構造、宇宙物理の初歩に関するクイズです。
    ${syllabus3rd}`;
    
    if (targetChapter !== null) {
      const chapterNames = {
        1: '1章：星座や星空の動き',
        2: '2章：太陽と月、地球の運動',
        3: '3章：太陽系の世界',
        4: '4章：ステラ・クロニクル（天文学の歴史）',
        5: '5章：銀河と宇宙の世界',
        6: '6章：宇宙開発と時事問題'
      };
      const chapterName = chapterNames[targetChapter];
      if (chapterName) {
        gradePrompt += `\n【出題指定】今回は必ず【${chapterName}】のトピックに密接に関連する、具体的で専門的な問題を作成してください。`;
      }
    }
  } else {
    gradePrompt = `天文宇宙検定4級（星空博士・公式テキスト準拠）のシラバスや出題傾向に完全に準拠した、月や太陽、惑星、星座、星空観察に関する基礎クイズです。
    公式テキストの出題基準・観点に忠実に、確かな知識を問う選択式問題を作成してください。
    ${syllabus4th}`;

    if (targetChapter !== null) {
      const chapterNames = {
        1: '1章：月と地球',
        2: '2章：太陽と地球',
        3: '3章：地球の仲間たち（太陽系・惑星・流星群）',
        4: '4章：夜空は星のキャンバス（四季の星座）',
        5: '5章：星と銀河の世界（恒星・星団・星雲・銀河）',
        6: '6章：気軽にスターウォッチング（観察入門）'
      };
      const chapterName = chapterNames[targetChapter];
      if (chapterName) {
        gradePrompt += `\n【出題指定】今回は必ず【${chapterName}】のトピックに密接に関連する、公式テキストの出題基準に沿った問題を作成してください。`;
      }
    }
  }

  let exclusionPrompt = '';
  if (excludeQuestions && excludeQuestions.length > 0) {
    const listStr = excludeQuestions.map((q) => `  - ${q}`).join('\n');
    exclusionPrompt += `
    - 【最重要・絶対遵守】以下の「直近の数問」と**「質問の趣旨・テーマ・正解の対象」が絶対に重複しない、全く異なる新しい天文学のテーマから出題してください**。
    - 直近の数問:
    ${listStr}
    `;
  }

  if (recentQuestions && recentQuestions.length > 0) {
    const listStr = recentQuestions.map((q) => `  - ${q}`).join('\n');
    exclusionPrompt += `
    - 【重要】以下の「最近出題された問題リスト（最大30問）」ともできるだけテーマや題材が重複しないようにしてください。
    - 最近出題された問題リスト:
    ${listStr}
    `;
  }

  if (targetChapter !== null) {
    exclusionPrompt += `
    - 【最重要】今回指定された章の具体的なシラバス項目に沿った内容にしてください。それ以外の章のテーマからの出題はエラーとなります。
    `;
  }

  // 画像指定用のプロンプト構築
  let imagePrompt = '';
  let jsonFormatPrompt = `
  {
    "question": "問題文（ルビ必須）",
    "choices": ["選択肢1（ルビ必須）", "選択肢2（ルビ必須）", "選択肢3（ルビ必須）", "選択肢4（ルビ必須）"],
    "answerIndex": 0, // 正解のインデックス（0, 1, 2, 3 のいずれか）
    "explanation": "子ども向け解説（ルビ必須）"
  }`;

  if (targetImage !== null) {
    imagePrompt = `
    - 【最重要・画像クイズ作成指示】今回は必ず、以下の画像（ID: "${targetImage.id}"）を利用したクイズを作成してください。
    - 画像の説明・内容: "${targetImage.description}"
    - ユーザーはこの画像を画面で見ながらクイズに答えます。
    - 問題文の中で「この写真にある〜」「図の中の〜」のように、画像を明確に指し示す言葉（例: 「この図の」「この写真の」など）を含めて質問を作成してください。
    - 出力するJSONには、必ず "imageId" フィールドを追加し、"${targetImage.id}" を設定してください。
    `;

    jsonFormatPrompt = `
  {
    "question": "問題文（ルビ必須、画像に言及する）",
    "choices": ["選択肢1（ルビ必須）", "選択肢2（ルビ必須）", "選択肢3（ルビ必須）", "選択肢4（ルビ必須）"],
    "answerIndex": 0, // 正解のインデックス（0, 1, 2, 3 のいずれか）
    "explanation": "子ども向け解説（ルビ必須）",
    "imageId": "${targetImage.id}"
  }`;
  }

  const prompt = `
  ${gradePrompt}を1問、JSONフォーマットで生成してください。
  以下のルールを厳密に守ってください。

  - 【超重要】選択肢は必ず【4つ】生成してください。
  - 【超重要】難易度に関わらず、すべての漢字にHTML形式のルビ（ふりがな）を振ること。
    ルビの書き方例: <ruby>望遠鏡<rt>ぼうえんきょう</rt></ruby> のように記述してください。ひらがなやカタカナ、数字にルビを振る必要はありません。
  - 選択肢(choices), および解説(explanation)に含まれる漢字にも必ず同様のルビルールを適用してください。
  - 解説は子供（小学校低学年でも読める）向けに、優しくロマンがある表現で記述してください。
  ${exclusionPrompt}
  ${imagePrompt}

  【出力フォーマット】
  必ず以下のJSONフォーマットのみで出力してください。Markdownのコードブロックなども一切付けないでください。

  ${jsonFormatPrompt}
  `;

  const candidateModels = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];
  for (let i = 0; i < candidateModels.length; i++) {
    const currentModelName = candidateModels[i];
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${currentModelName}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      if (!response.ok) {
        let errorDetails = '';
        try {
          errorDetails = await response.text();
        } catch (_) {}
        throw new Error(`Gemini API HTTP error! status: ${response.status}. Details: ${errorDetails}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text.trim();
      const quiz = JSON.parse(text);

      if (validateTestQuiz(quiz, targetImage)) {
        quiz.id = `test_${grade}_` + Date.now() + '_' + Math.floor(Math.random() * 1000);
        return quiz;
      }
      console.warn(`Test quiz failed validation with ${currentModelName}, trying next...`);
    } catch (e) {
      console.error(`Attempt failed for test quiz with model ${currentModelName}. Error: ${e.message}`);
    }
  }

  throw new Error('Failed to generate a valid test quiz after multiple attempts.');
}

function validateTestQuiz(quiz, targetImage = null) {
  if (!quiz) return false;
  sanitizeQuizRubies(quiz);
  if (typeof quiz.question !== 'string' || quiz.question.length < 5) return false;
  if (!Array.isArray(quiz.choices) || quiz.choices.length !== 4) return false;
  if (typeof quiz.answerIndex !== 'number' || quiz.answerIndex < 0 || quiz.answerIndex > 3) return false;
  if (typeof quiz.explanation !== 'string' || quiz.explanation.length < 5) return false;

  const uniqueChoices = new Set(quiz.choices);
  if (uniqueChoices.size !== 4) return false;

  const kanjiRegex = /[\u4e00-\u9faf]/;
  if (kanjiRegex.test(quiz.question) && !quiz.question.includes('<ruby>')) return false;

  // 画像指定時のバリデーション
  if (targetImage !== null) {
    if (quiz.imageId !== targetImage.id) {
      console.warn(`Validation failed: imageId mismatch. Expected: ${targetImage.id}, Got: ${quiz.imageId}`);
      return false;
    }
  }

  return true;
}

// --- Stripe API 連携ヘルパー (ライブラリ依存ゼロの HTTPS Fetch) ---
async function createStripeCheckoutSession(userId, email, successUrl, cancelUrl, planType = 'subscription', currentPassExpiresAt = null) {
  const params = new URLSearchParams();
  if (email) params.append('customer_email', email);
  if (userId) params.append('client_reference_id', userId);

  if (planType === 'pass_30d') {
    // 30日間買い切りパス（400円・1回払い・動的決済手段：カード/Apple Pay/PayPay等）
    params.append('mode', 'payment');
    
    // 成功URLに plan=pass_30d を付与
    const sep = successUrl.includes('?') ? '&' : '?';
    params.append('success_url', `${successUrl}${sep}plan=pass_30d`);
    params.append('cancel_url', cancelUrl);

    params.append('line_items[0][price_data][currency]', 'jpy');
    params.append('line_items[0][price_data][unit_amount]', '400');
    params.append('line_items[0][price_data][product_data][name]', '30日間あそび放題パス（宇宙クイズ-AI）');
    params.append('line_items[0][quantity]', '1');
  } else {
    // 宇宙博士プラン（月額380円・毎月サブスク）
    params.append('mode', 'subscription');
    
    // 30日パス契約中からの切り替え時：残日数を無料トライアル期間（trial_end）として引き継ぎ
    if (currentPassExpiresAt) {
      const expiresAtMs = typeof currentPassExpiresAt === 'number' 
        ? currentPassExpiresAt 
        : new Date(currentPassExpiresAt).getTime();
      const nowMs = Date.now();
      const remainingSec = Math.floor((expiresAtMs - nowMs) / 1000);

      // 残り期間がある場合のみトライアル終了日を設定
      if (remainingSec > 0) {
        // Stripe API要件: trial_end は最低48時間先である必要があるため、
        // 48時間未満の場合は48時間後（約2日間プレゼント）にしてStripeのエラーを防止
        const minTrialSec = Math.floor(nowMs / 1000) + (48 * 3600 + 60);
        const trialEndSec = Math.max(Math.floor(expiresAtMs / 1000), minTrialSec);
        params.append('subscription_data[trial_end]', trialEndSec.toString());
      }
    }
    
    const sep = successUrl.includes('?') ? '&' : '?';
    params.append('success_url', `${successUrl}${sep}plan=subscription`);
    params.append('cancel_url', cancelUrl);

    if (STRIPE_PRICE_ID) {
      params.append('line_items[0][price]', STRIPE_PRICE_ID);
      params.append('line_items[0][quantity]', '1');
    } else {
      params.append('line_items[0][price_data][currency]', 'jpy');
      params.append('line_items[0][price_data][unit_amount]', '380');
      params.append('line_items[0][price_data][recurring][interval]', 'month');
      params.append('line_items[0][price_data][product_data][name]', '宇宙博士プラン（全ゲームあそび放題）');
      params.append('line_items[0][quantity]', '1');
    }
  }

  const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe API error: ${res.status} ${errText}`);
  }

  return await res.json();
}

async function createStripePortalSession(customerId, returnUrl) {
  const params = new URLSearchParams();
  params.append('customer', customerId);
  params.append('return_url', returnUrl);

  const res = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe Portal API error: ${res.status} ${errText}`);
  }

  return await res.json();
}
