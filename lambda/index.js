// AWS Lambda 関数 (Node.js 18+)
// Gemini API を直接 HTTPS Fetch で呼び出すことで、追加のライブラリ依存性をゼロにし、
// 超軽量・高速・低コストなサーバーレスAPIを実現します。

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const handler = async (event) => {
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
    const isTest = body.isTest || false;
    const grade = body.grade || '4';

    let quiz;
    if (isTest) {
      // 天文宇宙検定クイズの生成
      quiz = await generateTestQuiz(grade, answeredIds);
    } else {
      // 通常の宇宙クイズ生成
      quiz = await generateQuiz(difficulty, answeredIds);
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
async function generateQuiz(difficulty, answeredIds) {
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

  const exclusionPrompt = answeredIds.length > 0 
    ? `以下の問題と重複しない、新しい問題を作成してください (過去出題ワード: ${answeredIds.slice(-10).join(', ')})`
    : '';

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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP error! status: ${response.status}`);
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
async function generateTestQuiz(grade, answeredIds) {
  const gradePrompt = grade === '3' 
    ? '天文宇宙検定3級（星空準案内人・一般天文学の基礎）のシラバスや出題傾向に準拠した、やや専門的な天文学の歴史、太陽の構造、宇宙物理の初歩に関するクイズ'
    : '天文宇宙検定4級（星空博士・主に中学生や星空に興味がある子供向け）のシラバスや出題傾向に準拠した、月や太陽、星座の動き、基本的な天体観測に関するクイズ';

  const exclusionPrompt = answeredIds.length > 0 
    ? `以下の問題と重複しない、新しい問題を作成してください (過去出題ワード: ${answeredIds.slice(-10).join(', ')})`
    : '';

  const prompt = `
  ${gradePrompt}を1問、JSONフォーマットで生成してください。
  以下のルールを厳密に守ってください。

  - 【超重要】選択肢は必ず【4つ】生成してください。
  - 【超重要】難易度に関わらず、すべての漢字にHTML形式のルビ（ふりがな）を振ること。
    ルビの書き方例: <ruby>望遠鏡<rt>ぼうえんきょう</rt></ruby> のように記述してください。ひらがなやカタカナ、数字にルビを振る必要はありません。
  - 選択肢(choices)、および解説(explanation)に含まれる漢字にも必ず同様のルビルールを適用してください。
  - 解説は子供（小学校低学年でも読める）向けに、優しくロマンがある表現で記述してください。
  ${exclusionPrompt}

  【出力フォーマット】
  必ず以下のJSONフォーマットのみで出力してください。Markdownのコードブロックなども一切付けないでください。

  {
    "question": "問題文（ルビ必須）",
    "choices": ["選択肢1（ルビ必須）", "選択肢2（ルビ必須）", "選択肢3（ルビ必須）", "選択肢4（ルビ必須）"],
    "answerIndex": 0,
    "explanation": "子ども向け解説（ルビ必須）"
  }
  `;

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text.trim();
      const quiz = JSON.parse(text);

      if (validateTestQuiz(quiz)) {
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

function validateTestQuiz(quiz) {
  if (!quiz) return false;
  if (typeof quiz.question !== 'string' || quiz.question.length < 5) return false;
  if (!Array.isArray(quiz.choices) || quiz.choices.length !== 4) return false;
  if (typeof quiz.answerIndex !== 'number' || quiz.answerIndex < 0 || quiz.answerIndex > 3) return false;
  if (typeof quiz.explanation !== 'string' || quiz.explanation.length < 5) return false;

  const uniqueChoices = new Set(quiz.choices);
  if (uniqueChoices.size !== 4) return false;

  const kanjiRegex = /[\u4e00-\u9faf]/;
  if (kanjiRegex.test(quiz.question) && !quiz.question.includes('<ruby>')) return false;

  return true;
}
