// AWS Lambda 関数 (Node.js 18+)
// Gemini API を直接 HTTPS Fetch で呼び出すことで、追加のライブラリ依存性をゼロにし、
// 超軽量・高速・低コストなサーバーレスAPIを実現します。

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"\s]/g, '') : '';

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

  // APIキー未設定エラー
  if (!GEMINI_API_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured on AWS Lambda.' })
    };
  }

  try {
    // リクエストボディのパース
    let body = {};
    if (event.body) {
      body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
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

  let retries = 3;
  while (retries > 0) {
    try {
      // Node.js 18 以降で標準提供されているグローバル fetch を使用
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
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
      console.warn('Quiz failed validation, retrying...');
    } catch (e) {
      console.error(`Attempt failed. Retries left: ${retries - 1}. Error: ${e.message}`);
    }
    retries--;
  }

  throw new Error('Failed to generate a valid quiz after multiple attempts.');
}

// バリデーション関数
function validateQuiz(quiz, difficulty) {
  if (!quiz) return false;
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
  【天文宇宙検定4級のシラバス章構成】
  - 0章：宇宙にのりだそう（宇宙開発や宇宙飛行士の活動、国際宇宙ステーション（ISS）や日本の実験棟「きぼう」、人工衛星や探査機（はやぶさ2など）のお仕事など）
  - 1章：月と地球（月のクレーターや性質、地球からいつも同じ面しか見えない理由、公転・自転、月食や日食が起こるしくみなど）
  - 2章：太陽と地球（太陽についての基礎知識、太陽の表面の様子（黒点やプロミネンスなど）、太陽が地球に及ぼす影響など）
  - 3章：太陽系の世界（太陽を回る惑星の特徴（水金地火木土天海、環・衛星のひみつ）、流れ星（流星）や彗星（ほうき星）の正体、惑星の名前とギリシャ・ローマ神話の関連（例：木星＝ジュピター）など）
  - 4章：星座の世界（四季の代表的な星座と一等星（織ひめ星やひこ星など）、星座の見え方の移り変わり（カレンダーとしての星座）、星座にまつわる神話など）
  - 5章：星と銀河の世界（星の色と温度の関係、たくさんの星が集まる「銀河（天の川銀河）」の姿など）
  - 6章：天体観察入門（星座早見盤の使い方、双眼鏡や天体望遠鏡で星を観察するときのコツや注意点など）
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
    gradePrompt = `天文宇宙検定4級（星空博士・主に中学生や星空に興味がある子供向け）のシラバスや出題傾向に準拠した、月や太陽、星座の動き、基本的な天体観測に関するクイズです。
    ${syllabus4th}`;

    if (targetChapter !== null) {
      const chapterNames = {
        0: '0章：宇宙にのりだそう',
        1: '1章：月と地球',
        2: '2章：太陽と地球',
        3: '3章：太陽系の世界',
        4: '4章：星座の世界',
        5: '5章：星と銀河の世界',
        6: '6章：天体観察入門'
      };
      const chapterName = chapterNames[targetChapter];
      if (chapterName) {
        gradePrompt += `\n【出題指定】今回は必ず【${chapterName}】のトピックに密接に関連する、具体的でやさしい問題を作成してください。`;
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

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
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
      console.warn('Test quiz failed validation, retrying...');
    } catch (e) {
      console.error(`Attempt failed for test quiz. Retries left: ${retries - 1}. Error: ${e.message}`);
    }
    retries--;
  }

  throw new Error('Failed to generate a valid test quiz after multiple attempts.');
}

function validateTestQuiz(quiz, targetImage = null) {
  if (!quiz) return false;
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
