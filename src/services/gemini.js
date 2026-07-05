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
      question: 'あさになると のぼってきて、まわりを あかるく ポカポカにしてくれる おおきなほしは なあに？',
      choices: ['ひがし', 'にし', 'みなみ'],
      answerIndex: 0,
      explanation: 'たいようは 「ひがし」から のぼって、「にし」へ しずむよ。ちきゅうが コマのように まわっているから そうみえるんだ。'
    },
    {
      id: 'fb_e6',
      question: 'うちゅうステーションで くらしている うちゅうひこうしさんは、どうやって ねむるのかな？',
      choices: ['たったまま ねる', 'ふわふわ うきながら ねる', 'かべに ふくろを はりつけて そのなかで ねる'],
      answerIndex: 2,
      explanation: 'うちゅうは むじゅうりょく（ふわふわ うく）だから、ねている あいだに かべに ぶつからないように、かべの ねぶくろの なかに入って ねるんだよ。'
    },
    {
      id: 'fb_e7',
      question: 'たいようと ちきゅうは、どっちの ほうが おおきいかな？',
      choices: ['ちきゅう', 'たいよう', 'おなじ おおきさ'],
      answerIndex: 1,
      explanation: 'たいようは とても おおきくて、ちきゅうが 100こ ならぶ くらいの おおきさんだよ！'
    },
    {
      id: 'fb_e8',
      question: 'つきには、くうき（いきをするための 空気）は あるかな？',
      choices: ['たくさん ある', 'すこし ある', 'まったくない'],
      answerIndex: 2,
      explanation: 'つきには くうきが まったくないんだ。だから うちゅうひこうしさんは、くうきが入った うちゅうふくを きて いくんだよ。'
    },
    {
      id: 'fb_e9',
      question: 'よるに そらで いちばん あかるく ひかる おほしさま（わくせい）は なあに？',
      choices: ['きんせい（よいの みょうじょう）', 'かせい', 'どせい'],
      answerIndex: 0,
      explanation: 'きんせいは「よいの みょうじょう」とも よばれていて、ゆうがたや あさかたに とても あかるく ピカピカ ひかって みえるんだよ。'
    },
    {
      id: 'fb_e10',
      question: 'ロケットが うちゅうに いくとき、したから なにを だして とぶかな？',
      choices: ['みず', 'ものすごい ほのおと けむり', 'しゃぼんだま'],
      answerIndex: 1,
      explanation: 'ロケットは、ものすごい おとと ともに ほのおと けむりを したから いきおいよく だして、その ちからで うちゅうへと とびたつんだよ。'
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
    },
    {
      id: 'fb_m6',
      question: '<ruby>月<rt>つき</rt></ruby>の<ruby>重力<rt>じゅうりょく</rt></ruby>（<ruby>地面<rt>じめん</rt></ruby>に<ruby>引<rt>ひ</rt></ruby>っぱる<ruby>力<rt>ちから</rt></ruby>）は、<ruby>地球<rt>ちきゅう</rt></ruby>のどれくらいかな？',
      choices: ['<ruby>約<rt>やく</rt></ruby>6<ruby>倍<rt>ばい</rt></ruby>', '<ruby>約<rt>やく</rt></ruby>6<ruby>分<rt>ぶん</rt></ruby>の1', '<ruby>同<rt>おな</rt></ruby>じ'],
      answerIndex: 1,
      explanation: '<ruby>正解<rt>せいかい</rt></ruby>は「<ruby>約<rt>やく</rt></ruby>6<ruby>分<rt>ぶん</rt></ruby>の1」です！だから、<ruby>月<rt>つき</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>では<ruby>体<rt>からだ</rt></ruby>がふわふわと<ruby>軽<rt>かる</rt></ruby>くなり、<ruby>地球<rt>ちきゅう</rt></ruby>の6<ruby>倍<rt>ばい</rt></ruby>も<ruby>高<rt>たか</rt></ruby>くジャンプできるんだよ。'
    },
    {
      id: 'fb_m7',
      question: '<ruby>星<rt>ほし</rt></ruby>がたくさん<ruby>集<rt>あつ</rt></ruby>まった、うずまきや<ruby>丸<rt>まる</rt></ruby>い<ruby>形<rt>かたち</rt></ruby>をした<ruby>大<rt>おお</rt></ruby>きなグループを何（なに）と呼ぶ（よぶ）？',
      choices: ['<ruby>銀河<rt>ぎんが</rt></ruby>', '<ruby>彗星<rt>すいせい</rt></ruby>', '<ruby>星座<rt>せいざ</rt></ruby>'],
      answerIndex: 0,
      explanation: 'たくさんの<ruby>星<rt>ほし</rt></ruby>（<ruby>数千億個<rt>すうせんおくこ</rt></ruby>）が<ruby>集<rt>あつ</rt></ruby>まったグループを「<ruby>銀河<rt>ぎんが</rt></ruby>」と呼ぶ（よぶ）よ。<ruby>私<rt>わたし</rt></ruby>たちの<ruby>地球<rt>ちきゅう</rt></ruby>も「<ruby>天<rt>あま</rt></ruby>の<ruby>川<rt>がわ</rt></ruby><ruby>銀河<rt>ぎんが</rt></ruby>」というグループの<ruby>中<rt>なか</rt></ruby>にいるんだ。'
    },
    {
      id: 'fb_m8',
      question: '<ruby>太陽系<rt>たいようけい</rt></ruby>で、<ruby>太陽<rt>たいよう</rt></ruby>のまわりをまわるわくせりは<ruby>全部<rt>ぜんぶ</rt></ruby>でいくつあるかな？',
      choices: ['5つ', '8つ', '12こ'],
      answerIndex: 1,
      explanation: '<ruby>太陽系<rt>たいようけい</rt></ruby>のわくせいは、<ruby>水星<rt>すいせい</rt></ruby>・<ruby>金星<rt>きんせい</rt></ruby>・<ruby>地球<rt>ちきゅう</rt></ruby>・<ruby>火星<rt>かせい</rt></ruby>・<ruby>木星<rt>もくせい</rt></ruby>・<ruby>土星<rt>どせい</rt></ruby>・<ruby>天王星<rt>てんのうせい</rt></ruby>・<ruby>海王星<rt>海王星</rt></ruby>の「8つ」だよ！'
    },
    {
      id: 'fb_m9',
      question: '<ruby>太陽<rt>たいよう</rt></ruby>の<ruby>表面<rt>ひょうめん</rt></ruby>にある、まわりより<ruby>温度<rt>おんど</rt></ruby>が<ruby>低<rt>ひく</rt></ruby>くて<ruby>黒<rt>くろ</rt></ruby>く見える場所（ばしょ）を何（なに）と呼ぶ（よぶ）？',
      choices: ['<ruby>黒点<rt>こくてん</rt></ruby>', '<ruby>青点<rt>あおてん</rt></ruby>', '<ruby>光球<rt>こうきゅう</rt></ruby>'],
      answerIndex: 0,
      explanation: '「<ruby>黒点<rt>こくてん</rt></ruby>」はまわりより<ruby>約<rt>やく</rt></ruby>2000<ruby>度<rt>ど</rt></ruby>も<ruby>温度<rt>おんど</rt></ruby>が<ruby>低<rt>ひく</rt></ruby>いため、<ruby>黒<rt>くろ</rt></ruby>く見えているんだ。<ruby>太陽<rt>たいよう</rt></ruby>の<ruby>磁石<rt>じしゃく</rt></ruby>の<ruby>力<rt>ちから</rt></ruby>で作られるよ。'
    },
    {
      id: 'fb_m10',
      question: '<ruby>流<rt>なが</rt></ruby>れ<ruby>星<rt>ぼし</rt></ruby>の<ruby>正体<rt>しょうたい</rt></ruby>は、<ruby>宇宙<rt>うちゅう</rt></ruby>に<ruby>浮<rt>う</rt>かぶ</ruby>何（なに）かな？',
      choices: ['<ruby>小<rt>ちい</rt></ruby>さなチリや<ruby>石<rt>いし</rt></ruby>の<ruby>粒<rt>つぶ</rt></ruby>', '<ruby>本物<rt>ほんもの</rt></ruby>の<ruby>星<rt>ぼし</rt></ruby>', '<ruby>宇宙人<rt>うちゅうじん</rt></ruby>の<ruby>乗<rt>の</rt></ruby>り<ruby>物<rt>もの</rt></ruby>'],
      answerIndex: 0,
      explanation: '<ruby>宇宙<rt>うちゅう</rt></ruby>にある<ruby>小<rt>ちい</rt></ruby>さなチリや<ruby>砂<rt>すな</rt></ruby>つぶが、<ruby>地球<rt>ちきゅう</rt></ruby>の<ruby>空気<rt>くうき</rt></ruby>にぶつかって<ruby>激<rt>はげ</rt></ruby>しく燃える（もえる）ときの<ruby>光<rt>ひかり</rt></ruby>が<ruby>流<rt>なが</rt></ruby>れ<ruby>星<rt>ぼし</rt></ruby>だよ。'
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
    },
    {
      id: 'fb_h6',
      question: '<ruby>地球<rt>ちきゅう</rt></ruby>から一番（いちばん）近い（ちかい）<ruby>恒星<rt>こうせい</rt></ruby>（<ruby>太陽<rt>たいよう</rt></ruby>をのぞく）である、<ruby>約<rt>やく</rt></ruby>4.2光年（こうねん）離れた（はなれた）場所（ばしょ）にある星の名前は？',
      choices: ['シリウス', 'プロキシマ・ケンタウリ', 'ベテルギウス'],
      answerIndex: 1,
      explanation: '正解は「プロキシマ・ケンタウリ」です。<ruby>約<rt>やく</rt></ruby>4.2光年という距離（きょり）は、光の速さで進んでも<ruby>約<rt>やく</rt></ruby>4年4ヶ月かかるほど遠い場所です。'
    },
    {
      id: 'fb_h7',
      question: '<ruby>太陽系<rt>たいようけい</rt></ruby>のなかで、自転軸（じてんじく）がほぼ横倒し（よこだおし）の状態でまわっている惑星（わくせい）は？',
      choices: ['<ruby>海王星<rt>かいおうせい</rt></ruby>', '<ruby>天王星<rt>てんのうせい</rt></ruby>', '<ruby>土星<rt>どせい</rt></ruby>'],
      answerIndex: 1,
      explanation: '正解は「天王星」です。なぜ横倒しになったかは謎（なぞ）ですが、大昔（おおむかし）に巨大な天体が衝突（しょうとつ）したためと考えられています。'
    },
    {
      id: 'fb_h8',
      question: '<ruby>宇宙<rt>うちゅう</rt></ruby>の始まりとされる大爆発を「ビッグバン」と呼びますが、それは今から<ruby>約<rt>やく</rt></ruby>何年前に起きた？',
      choices: ['<ruby>約<rt>やく</rt></ruby>46億年前', '<ruby>約<rt>やく</rt></ruby>138億年前', '<ruby>約<rt>やく</rt></ruby>500億年前'],
      answerIndex: 1,
      explanation: '正解は「約138億年前」です。その後、宇宙は今でも膨らみ（ふくらみ）続けています。なお、地球が誕生（たんじょう）したのは約46億年前です。'
    },
    {
      id: 'fb_h9',
      question: '<ruby>土星<rt>どせい</rt></ruby>の環（わ・リング）の主な（おもな）成分は、何でできているかな？',
      choices: ['<ruby>宇宙<rt>うちゅう</rt></ruby>ゴミ', '岩石とガス', '氷の粒や岩石'],
      answerIndex: 2,
      explanation: '正解は「氷の粒や岩石」です。数センチメートルから数メートルの大きさの氷が、土星のまわりを高速で回って（まわって）輝いて（かがやいて）見えています。'
    },
    {
      id: 'fb_h10',
      question: '<ruby>火星<rt>かせい</rt></ruby>にある、高さが<ruby>約<rt>やく</rt></ruby>22キロメートル（エベレストの2.5倍以上）もある<ruby>太陽系<rt>たいようけい</rt></ruby>で最大の火山は？',
      choices: ['オリンポス<ruby>山<rt>さん</rt></ruby>', 'アルシア<ruby>山<rt>さん</rt></ruby>', 'アスクレウス<ruby>山<rt>さん</rt></ruby>'],
      answerIndex: 0,
      explanation: '正解は「オリンポス山」です。火星には地面が動く仕組み（プレートテクトニクス）がないため、同じ場所で火山が噴火し続けてここまでの巨大さになりました。'
    }
  ]
};

// APIキーを取得（Viteの環境変数または直接定義）
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

// API GatewayのURLを取得（本番環境用）
const getApiGatewayUrl = () => {
  return import.meta.env.VITE_API_GATEWAY_URL || '';
};

// Gemini APIを用いてクイズを生成する関数
export const generateQuizFromAI = async (difficulty, answeredIds = []) => {
  const apiGatewayUrl = getApiGatewayUrl();

  // API Gateway の URL が設定されている場合は、AWS Lambda バックエンドを呼び出す
  if (apiGatewayUrl) {
    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ difficulty, answeredIds })
      });

      if (response.ok) {
        const quiz = await response.json();
        return quiz;
      }
      console.warn('API Gateway request failed, falling back to local client-side.');
    } catch (e) {
      console.error('Failed to fetch from API Gateway, falling back to local client-side.', e);
    }
  }

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

// 天文宇宙検定のフォールバック用クイズデータ
const FALLBACK_TEST_QUIZZES = {
  '4': [
    {
      id: 'fb_t4_1',
      question: '<ruby>太陽<rt>たいよう</rt></ruby>の光（ひかり）が反射（はんしゃ）して光る、<ruby>地球<rt>ちきゅう</rt></ruby>のただひとつの<ruby>衛星<rt>えいせい</rt></ruby>（おともだちの星）はなあに？',
      choices: ['<ruby>月<rt>つき</rt></ruby>', '<ruby>火星<rt>かせい</rt></ruby>', '<ruby>水星<rt>すいせい</rt></ruby>', '<ruby>金星<rt>きんせい</rt></ruby>'],
      answerIndex: 0,
      explanation: '<ruby>月<rt>つき</rt></ruby>はみずから光っているのではなく、<ruby>太陽<rt>たいよう</rt></ruby>の光をあびてピカピカ反射（はんしゃ）して光って見えているんだよ。'
    },
    {
      id: 'fb_t4_2',
      question: '「なつデネブ、はるアルクトゥルス、あきフォーマルハウト、ふゆシリアス」これらは何（なに）のなまえ？',
      choices: ['星座（せいざ）のなまえ', '宇宙船（うちゅうせん）のなまえ', '１等星（いっとうせい）という、とても明るい星のなまえ', '銀河（ぎんが）のなまえ'],
      answerIndex: 2,
      explanation: '夜空（よぞら）でいちばん明るく見えるグループの星たちを「１等星（いっとうせい）」と呼ぶんだよ。シリウスは冬（ふゆ）にいちばん明るくかがやくよ！'
    },
    {
      id: 'fb_t4_3',
      question: '<ruby>太陽<rt>たいよう</rt></ruby>のまわりをまわる８つの惑星（わくせい）のなかで、いちばん<ruby>太陽<rt>たいよう</rt></ruby>にちかい場所（ばしょ）をまわるのはどれ？',
      choices: ['<ruby>地球<rt>ちきゅう</rt></ruby>', '<ruby>金星<rt>きんせい</rt></ruby>', '<ruby>水星<rt>すいせい</rt></ruby>', '<ruby>火星<rt>かせい</rt></ruby>'],
      answerIndex: 2,
      explanation: '<ruby>太陽<rt>たいよう</rt></ruby>に近いほうから「すい（水）・きん（金）・ち（地）・か（火）・もく（木）・ど（土）・てん（天）・かい（海）」のじゅんばんだよ。いちばん近いのは「水星（すいせい）」だね！'
    },
    {
      id: 'fb_t4_4',
      question: '日本（にほん）でいちばん最初（さいしょ）に宇宙（うちゅう）へ行った、秋山（あきやま）さんがのったソ連（れん）の宇宙船（うちゅうせん）のなまえは？',
      choices: ['アポロ', 'ソユーズ', 'スペースシャトル', 'はやぶさ'],
      answerIndex: 1,
      explanation: '1990年、テレビの記者（きしゃ）だった秋山（あきやま）豊寛（とよひろ）さんがソユーズという宇宙船（うちゅうせん）にのって、日本人で初めて宇宙へ行ったんだよ。'
    },
    {
      id: 'fb_t4_5',
      question: '夏（なつ）の夜空（よぞら）にみえる「夏（なつ）の大三角（だいさんかく）」をつくる星は、デネブ、ベガと、あとひとつは何（なに）かな？',
      choices: ['シリウス', 'ベテルギウス', 'アルタイル', 'アンタレス'],
      answerIndex: 2,
      explanation: 'わし座（ざ）のアルタイル（ひこ星）、こと座（ざ）のベガ（おりひめ星）、はくちょう座（ざ）のデネブをつなぐと、大きな「夏（なつ）の大三角（だいさんかく）」になるよ。'
    }
  ],
  '3': [
    {
      id: 'fb_t3_1',
      question: '1609年に望遠鏡（ぼうえんきょう）を初めて夜空（よぞら）に向け、木星（もくせい）のまわりをまわる４つの大きな衛星（えいせい）を見つけたイタリアの学者は？',
      choices: ['コペルニクス', 'ケプラー', 'ガリレオ・ガリレイ', 'アイザック・ニュートン'],
      answerIndex: 2,
      explanation: 'ガリレオは自作（じさく）の望遠鏡で木星をかんさつし、イオ、エウロパ、ガニメデ、カリストという４つの大きな月（ガリレオ衛星）を発見したよ。'
    },
    {
      id: 'fb_t3_2',
      question: '地球（ちきゅう）のまわりを太陽（たいよう）や星がまわっているという「天動説（てん動説）」に対して、太陽を中心に地球がまわっているという「地動説（ちどう説）」を本で発表したポーランドの天文学者は？',
      choices: ['プトレマイオス', 'ニコラウス・コペルニクス', 'エドウィン・ハッブル', 'アルバート・アインシュタイン'],
      answerIndex: 1,
      explanation: 'コペルニクスは「地動説（ちどうせつ）」を唱え、宇宙のまんなかには地球ではなく太陽がある、と科学的に主張（しゅちょう）して天文学に大革命（だいかくめい）をおこしたよ。'
    },
    {
      id: 'fb_t3_3',
      question: '太陽（たいよう）の表面（ひょうめん）でおこる超（ちょう）巨大なばくはつ現象（げんしょう）「フレア」によって地球にふきつける、電気を帯びた高速の風を何（なに）と呼ぶ？',
      choices: ['たいよう風（ふう）', 'オーロラ風（ふう）', 'ブラックホール熱（ねつ）', '宇宙（うちゅう）ハリケーン'],
      answerIndex: 0,
      explanation: '正解は「太陽風（たいようふう）」です。太陽からふき出すこの電気の粒子（りゅうし）が、地球のバリアをすり抜けて北極（ほっきょく）や南極（なんきょく）の空にぶつかることで「オーロラ」が光るんだよ。'
    },
    {
      id: 'fb_t3_4',
      question: '質量（しつりょう）が非常に大きく、重力が強すぎて光さえも吸い込んで出てこられない、アインシュタインの相対性理論（そうたいせいりろん）から予言された天体は？',
      choices: ['中性子星（ちゅうせいしせい）', 'ホワイトドワーフ（白色矮星）', 'ブラックホール', '超新星（ちょうしんせい）'],
      answerIndex: 2,
      explanation: 'ブラックホールはその強力（きょうりょく）な引力（じゅうりょく）のため、あらゆる物質（ぶっしつ）や光すら脱出（だっしゅつ）できなくしてしまいます。'
    },
    {
      id: 'fb_t3_5',
      question: '2010年に小惑星（しょうわくせい）「イトカワ」から岩石の微粒子（サンプル）をカプセルに入れて地球に持ち帰ることに成功した、日本の探査機（たんさき）のなまえは？',
      choices: ['はやぶさ', 'かぐや', 'あかつき', 'ひてん'],
      answerIndex: 0,
      explanation: '宇宙航空研究開発機構（JAXA）が打ち上げた「はやぶさ」は、多くの故障（こしょう）を乗り越えて7年かけて小惑星の砂を持ち帰るという、世界初の快挙（かいきょ）をなしとげたよ。'
    }
  ]
};

// 天文宇宙検定用のクイズ生成API
export const generateAstronomyTestQuiz = async (grade, answeredIds = []) => {
  const apiGatewayUrl = getApiGatewayUrl();

  // AWS Lambda バックエンドの呼び出しを試みる
  if (apiGatewayUrl) {
    try {
      const response = await fetch(apiGatewayUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isTest: true, grade, answeredIds })
      });

      if (response.ok) {
        const quiz = await response.json();
        return quiz;
      }
      console.warn('API Gateway test request failed, falling back to local client-side.');
    } catch (e) {
      console.error('Failed to fetch test quiz from API Gateway.', e);
    }
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not defined. Using fallback test quiz.');
    return getFallbackTestQuiz(grade, answeredIds);
  }

  // 4級または3級の定義プロンプト
  const gradePrompt = grade === '4' 
    ? '天文宇宙検定4級（星空博士・主に中学生や星空に興味がある子供向け）のシラバスや出題傾向に準拠した、月や太陽、星座の動き、基本的な天体観測に関するクイズ'
    : '天文宇宙検定3級（星空準案内人・一般天文学の基礎）のシラバスや出題傾向に準拠した、やや専門的な天文学の歴史、太陽の構造、宇宙物理の初歩に関するクイズ';

  const exclusionPrompt = answeredIds.length > 0 
    ? `以下の問題と重複しない、新しい問題を作成してください (除外された過去の問題IDやヒント: ${answeredIds.slice(-10).join(', ')})`
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
  必ず以下のJSONフォーマットのみで出力してください。Markdownのコードブロック (\`\`\`json) などは不要です。余計な説明文も一切付けないでください。

  {
    "question": "問題文（ルビ必須）",
    "choices": ["選択肢1（ルビ必須）", "選択肢2（ルビ必須）", "選択肢3（ルビ必須）", "選択肢4（ルビ必須）"],
    "answerIndex": 0, // 正解のインデックス（0, 1, 2, 3 のいずれか）
    "explanation": "子ども向け解説（ルビ必須）"
  }
  `;

  let retries = 3;
  while (retries > 0) {
    try {
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

      // バリデーション
      if (validateTestQuiz(quiz)) {
        quiz.id = `test_${grade}_` + Date.now() + '_' + Math.floor(Math.random() * 1000);
        return quiz;
      } else {
        console.warn('Test quiz failed validation. Retrying...', quiz);
      }
    } catch (e) {
      console.error('Failed to generate test quiz. Retries left: ' + (retries - 1), e);
    }
    retries--;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return getFallbackTestQuiz(grade, answeredIds);
};

// 検定クイズ用バリデーション
const validateTestQuiz = (quiz) => {
  if (!quiz) return false;
  if (typeof quiz.question !== 'string' || quiz.question.length < 5) return false;
  if (!Array.isArray(quiz.choices) || quiz.choices.length !== 4) return false;
  if (typeof quiz.answerIndex !== 'number' || quiz.answerIndex < 0 || quiz.answerIndex > 3) return false;
  if (typeof quiz.explanation !== 'string' || quiz.explanation.length < 5) return false;

  const uniqueChoices = new Set(quiz.choices);
  if (uniqueChoices.size !== 4) return false;

  // 漢字ルビチェック
  const kanjiRegex = /[\u4e00-\u9faf]/;
  if (kanjiRegex.test(quiz.question) && !quiz.question.includes('<ruby>')) return false;

  return true;
};

// 検定用フォールバック
const getFallbackTestQuiz = (grade, answeredIds) => {
  const pool = FALLBACK_TEST_QUIZZES[grade] || FALLBACK_TEST_QUIZZES['4'];
  let available = pool.filter(q => !answeredIds.includes(q.id));
  if (available.length === 0) {
    available = pool;
  }
  const randomIndex = Math.floor(Math.random() * available.length);
  return { ...available[randomIndex] };
};
