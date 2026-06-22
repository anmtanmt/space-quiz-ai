// フォールバック用のクイズデータ（APIキーが未設定、またはエラーが発生した場合に使用）
const FALLBACK_QUIZZES = {
  easy: [
    {
      id: 'fb_e1',
      question: 'ちきゅうの まわりを まわっている、よるに ピカピカ ひかる まんまるいものは なあに？',
      choices: ['たいよう', 'つき', 'すいせい'],
      answerIndex: 1,
      explanation: 'ちきゅうの まわりを まわっているのは「つき」だよ。たいようは とても とおくにあって、ちきゅうが そのまわりを まわっているんだ。'
    },
    {
      id: 'fb_e2',
      question: 'たいようけいで いちばん おおきくて、しましまの もようがある わくせいは なあに？',
      choices: ['かせい', 'どせい', 'もくせい'],
      answerIndex: 2,
      explanation: 'いちばん おおきいのは「もくせい」だよ。どせいも おおきいけれど、もくせいの ほうが もっと おおきいんだ！'
    },
    {
      id: 'fb_e3',
      question: 'うちゅうに いくときに、うちゅうひこうしさんが きる おおきな ふくの なまえは？',
      choices: ['うちゅうふく', 'パジャマ', 'かっぱ'],
      answerIndex: 0,
      explanation: 'うちゅうは くうきがなくて とても さむいから、からだを まもるための とくべつな「うちゅうふく」を きるんだよ。'
    },
    {
      id: 'fb_e4',
      question: 'ちきゅうから うちゅうへ いくために のる、いきおいよく とびたつ のりものは なあに？',
      choices: ['ひこうき', 'ロケット', 'しんかんせん'],
      answerIndex: 1,
      explanation: 'ロケットは、ちきゅうの 重力（じゅうりょく）を ふりきって うちゅうへ いくために、ものすごい スピードで とぶ のりものだよ。'
    },
    {
      id: 'fb_e5',
      question: 'たいようは、どっちの ほうこうから のぼってくるかな？',
      choices: ['ひがし', 'にし', 'みなみ'],
      answerIndex: 0,
      explanation: 'たいようは 「ひがし」から のぼって、「にし」へ しずむよ。ちきゅうが コマのように まわっているから そうみえるんだ。'
    }
  ],
  medium: [
    {
      id: 'fb_m1',
      question: '太陽（たいよう）の光（ひかり）が <ruby>地球<rt>ちきゅう</rt></ruby>に <ruby>届<rt>とど</rt></ruby>くまでに、どれくらいの <ruby>時間<rt>じかん</rt></ruby>がかかるかな？',
      choices: ['約（やく）8秒（びょう）', '約（やく）8分（ふん）', '約（やく）8時間（じかん）'],
      answerIndex: 1,
      explanation: '光（ひかり）はものすごく <ruby>速<rt>はや</rt></ruby>いけれど、太陽（たいよう）と地球（ちきゅう）はとても <ruby>離<rt>はな</rt></ruby>れているから、届（とど）くまでに約（やく）8分（ふん）もかかるんだよ。'
    },
    {
      id: 'fb_m2',
      question: 'きれいな「わ（リング）」があって、水（みず）にぷかぷか <ruby>浮<rt>う</rt></ruby>くほど <ruby>軽<rt>かる</rt></ruby>いわくせいは なあに？',
      choices: ['<ruby>木星<rt>もくせい</rt></ruby>', '<ruby>土星<rt>どせい</rt></ruby>', '<ruby>天王星<rt>てんのうせい</rt></ruby>'],
      answerIndex: 1,
      explanation: '正解（せいかい）は「土星（どせい）」！土星（どせい）は氷（こおり）やガスでできていて、とても密度（みつど）が低い（ひくい）から、もし巨大（きょだい）なプールがあったら水（みず）に浮（う）いちゃうんだ。'
    },
    {
      id: 'fb_m3',
      question: '<ruby>地球<rt>ちきゅう</rt></ruby>のすぐとなりをまわっていて、赤（あか）い石（いし）やスナにおおわれた「赤（あか）いわくせい」とよばれるものは？',
      choices: ['<ruby>金星<rt>きんせい</rt></ruby>', '<ruby>水星<rt>すいせい</rt></ruby>', '<ruby>火星<rt>かせい</rt></ruby>'],
      answerIndex: 2,
      explanation: '「火星（かせい）」は地表（ちひょう）に鉄（てつ）のさびがたくさんあるから、赤（あか）っぽく見えるんだ。ロボットを送り（おくり）込んで、水（みず）のあとなどを探し（さがし）ているよ。'
    },
    {
      id: 'fb_m4',
      question: '宇宙（うちゅう）にいくと、ふわふわと体が（からだが）浮（う）いてしまうのは なぜかな？',
      choices: ['重力（じゅうりょく）がほとんど無い（ない）から', '風（かぜ）が強く（つよく）吹（ふ）いているから', '体が（からだが）軽く（かるく）なるから'],
      answerIndex: 0,
      explanation: '宇宙空間（うちゅうくうかん）や宇宙ステーション（うちゅうすてーしょん）の中（なか）は「無重力（むじゅうりょく）」に近い（ちかい）状態（じょうたい）だから、引っぱる（ひっぱる）力が（ちからが）なくて浮（う）いてしまうんだよ。'
    },
    {
      id: 'fb_m5',
      question: '夜空（よぞら）に光る（ひかる）「星座（せいざ）」のなかで、ひしゃくの形（かたち）をした「北斗七星（ほくとしちせい）」が含まれる（ふくまれる）のは何（なに）座（ざ）？',
      choices: ['こぐま座（ざ）', 'おおぐま座（ざ）', 'オリオン座（ざ）'],
      answerIndex: 1,
      explanation: '北斗七星（ほくとしちせい）は「おおぐま座（ざ）」のしっぽの部分（ぶぶん）にある、7つの明るい（あかるい）星（ほし）のあつまりだよ。'
    }
  ],
  hard: [
    {
      id: 'fb_h1',
      question: '太陽系（たいようけい）のなかで、もっとも火山（かざん）活動（かつどう）がさかんで、硫黄（いおう）の煙（けむり）をふきだしている木星（もくせい）の衛星（えいせい）は？',
      choices: ['エウロパ', 'イオ', 'ガニメデ'],
      answerIndex: 1,
      explanation: '正解（せいかい）は「イオ」です。木星（もくせい）の強い（つよい）重力（じゅうりょく）で引き（ひき）伸ばさ（のばさ）れて摩擦熱（まさつねつ）が発生（はっせい）し、地表（ちひょう）にたくさんの火山（かざん）があります。'
    },
    {
      id: 'fb_h2',
      question: '光（ひかり）すら吸い（すい）込んでしまい、一度（いちど）入ったら二度（にど）と出られない、宇宙（うちゅう）で一番（いちばん）重力（じゅうりょく）の強い（つよい）場所（ばしょ）は？',
      choices: ['ブラックホール', 'ホワイトホール', '超新星（ちょうしんせい）'],
      answerIndex: 0,
      explanation: '「ブラックホール」は、極めて（きわめて）重く（おもく）て強い（つよい）重力（じゅうりょく）を持つ（もつ）ため、天体（てんたい）だけでなく光（ひかり）さえも吸い（すい）込んで脱出（だっしゅつ）できなくしてしまいます。'
    },
    {
      id: 'fb_h3',
      question: '太陽（たいよう）のようにみずから光る（ひかる）星（ほし）を「恒星（こうせい）」といいますが、恒星（こうせい）の最後（さいご）の大爆発（だいばくはつ）を何（なに）と呼ぶ（よぶ）？',
      choices: ['超新星（ちょうしんせい）爆発（ばくはつ）', 'ビッグバン', 'ブラックホール爆発（ばくはつ）'],
      answerIndex: 0,
      explanation: '重い（おもい）恒星（こうせい）が一生（いっしょう）の終わりに（おわりに）起こす（おこす）大爆発（だいばくはつ）を「超新星（ちょうしんせい）爆発（ばくはつ）」と言い（いい）ます。この時の輝き（かがやき）は銀河（ぎんが）全体（ぜんたい）に匹敵（ひってき）します。'
    },
    {
      id: 'fb_h4',
      question: '日本（にほん）も開発（かいはつ）に参加（さんか）している、地上（ちじょう）から約（やく）400キロメートルの高さを（たかさを）まわっている宇宙施設（うちゅうしせつ）の略称（りゃくしょう）は？',
      choices: ['NASA', 'JAXA', 'ISS'],
      answerIndex: 2,
      explanation: '正解（せいかい）は「ISS（国際（こくさい）宇宙（うちゅう）ステーション）」です。さまざまな国が（くにが）協力（きょうりょく）して実験（じっけん）や宇宙（うちゅう）の観察（かんさつ）を行って（おこなって）います。'
    },
    {
      id: 'fb_h5',
      question: '冥王星（めいおうせい）は以前（いぜん）は「惑星（わくせい）」でしたが、2006年に新しく（あたらしく）決まった（きまった）ルールにより、何（なに）に分類（ぶんるい）されるようになった？',
      choices: ['準惑星（じゅんわくせい）', '小惑星（しょうわくせい）', '彗星（すいせい）'],
      answerIndex: 0,
      explanation: '冥王星（めいおうせい）は「準惑星（じゅんわくせい）」に再（さい）分類（ぶんるい）されました。まわりに似た（にた）ような天体（てんたい）がたくさんあり、軌道（きどう）からゴミを掃除（そうじ）しきれていないためです。'
    }
  ]
};

// APIキーを取得（Viteの環境変数または直接定義）
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// Gemini APIを用いてクイズを生成する関数
export const generateQuizFromAI = async (difficulty, answeredIds = []) => {
  const apiKey = getApiKey();
  
  // APIキーがない場合はフォールバックから即時返却
  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not defined. Using fallback quiz.');
    return getFallbackQuiz(difficulty, answeredIds);
  }

  // 難易度に応じたプロンプト制約の作成
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

  // 除外クイズ情報
  const exclusionPrompt = answeredIds.length > 0 
    ? `以下の問題と重複しない、新しい問題を作成してください (除外ワード/過去問題のヒント: ${answeredIds.slice(-10).join(', ')})`
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
  必ず以下のJSONフォーマットのみで出力してください。Markdownのコードブロック (\`\`\`json) などは不要です。余計な説明文も一切付けないでください。

  {
    "question": "問題文（ルビルール適用）",
    "choices": ["選択肢1（ルビルール適用）", "選択肢2（ルビルール適用）", "選択肢3（ルビルール適用）"],
    "answerIndex": 0, // 正解のインデックス（0, 1, 2 のいずれか）
    "explanation": "子ども向け解説（ルビルール適用）"
  }
  `;

  let retries = 3;
  while (retries > 0) {
    try {
      // @google/generative-ai の利用（標準的な初期化手順）
      // GoogleGenAI ではなく、SDK v0.x では GoogleGenerativeAI クラスを利用します。
      // パッケージのインポートを確認し、適切なAPI呼び出しを行います。
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      const quiz = JSON.parse(text);

      // バリデーションチェック
      if (validateQuiz(quiz, difficulty)) {
        // IDを自動付与
        quiz.id = 'ai_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        return quiz;
      } else {
        console.warn('Quiz failed validation. Retrying...', quiz);
      }
    } catch (e) {
      console.error('Failed to generate quiz from Gemini API. Retries left: ' + (retries - 1), e);
    }
    retries--;
    // 少し待ってからリトライ（100ms）
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 全てのリトライに失敗した場合はフォールバック
  console.warn('All Gemini API attempts failed. Falling back to static quiz list.');
  return getFallbackQuiz(difficulty, answeredIds);
};

// クイズデータの自動バリデーション
const validateQuiz = (quiz, difficulty) => {
  if (!quiz) return false;
  if (typeof quiz.question !== 'string' || quiz.question.length < 5) return false;
  if (!Array.isArray(quiz.choices) || quiz.choices.length !== 3) return false;
  if (typeof quiz.answerIndex !== 'number' || quiz.answerIndex < 0 || quiz.answerIndex > 2) return false;
  if (typeof quiz.explanation !== 'string' || quiz.explanation.length < 5) return false;

  // 選択肢のテキスト重複チェック
  const uniqueChoices = new Set(quiz.choices);
  if (uniqueChoices.size !== 3) return false;

  // 簡単な「漢字禁止」バリデーション（easyのみ）
  if (difficulty === 'easy') {
    // 漢字検出用正規表現（CJK統合漢字の範囲）
    const kanjiRegex = /[\u4e00-\u9faf]/;
    if (kanjiRegex.test(quiz.question) || kanjiRegex.test(quiz.explanation) || quiz.choices.some(c => kanjiRegex.test(c))) {
      console.warn('Validation failed: Easy mode contains kanji.');
      return false;
    }
  }

  // ルビが必要な難易度で、漢字にルビがないかどうかの簡易チェック（最低限 <ruby> が入っているか）
  if (difficulty === 'medium' || difficulty === 'hard') {
    const kanjiRegex = /[\u4e00-\u9faf]/;
    const hasKanji = kanjiRegex.test(quiz.question);
    const hasRuby = quiz.question.includes('<ruby>');
    
    // 漢字があるのに一度も <ruby> タグが現れない場合は無効とする
    if (hasKanji && !hasRuby) {
      console.warn('Validation failed: Medium/Hard mode contains kanji but no ruby tags.');
      return false;
    }
  }

  return true;
};

// ローカルのクイズプールから未回答のものを選択する
const getFallbackQuiz = (difficulty, answeredIds) => {
  const pool = FALLBACK_QUIZZES[difficulty] || FALLBACK_QUIZZES.easy;
  // 未回答のクイズをフィルター
  let available = pool.filter(q => !answeredIds.includes(q.id));
  
  // もし全て回答済みの場合は、履歴を無視して再出題
  if (available.length === 0) {
    available = pool;
  }
  
  // ランダムに1つ選択
  const randomIndex = Math.floor(Math.random() * available.length);
  // コピーを返して元のデータを汚染しないようにする
  return { ...available[randomIndex] };
};
