// 128個のバッジデータプール（カテゴリ別に分類）
export const BADGE_POOL = [
  // 🪐 1. わくせいエリア (26個)
  { id: 'b_sun', category: 'planets', name: 'たいよう バッジ', emoji: '☀️', color: '#fb8500', desc: 'ちきゅうに ひかりと あたたかさを くれる、もえる おおきな ほし！', image: '/assets/images/quiz/sun.png', detailDesc: '太陽の表面温度は約6000度、中心温度は約1500万度。地球の約109倍の大きさがあり、太陽系全体の99.8%の重さを占めています。' },
  { id: 'b_mercury', category: 'planets', name: 'すいせい バッジ', emoji: '🪙', color: '#8a8a8a', desc: 'たいぶりに いちばん ちかい、あつくて いしの おおい ほし！', detailDesc: '昼の表面温度は約430度、夜はマイナス170度まで下がる激しい温度差。大気がほとんどないため、隕石のクレーターがそのまま残っています。' },
  { id: 'b_venus', category: 'planets', name: 'きんせい バッジ', emoji: '✨', color: '#ffb703', desc: 'あつい くもに おおわれた、ピカピカ ひかる まぶしい ほし！', image: '/assets/images/badges/venus.png', detailDesc: '二酸化炭素の分厚い大気による温室効果で、表面温度は太陽系で一番熱い約470度。自転の向きが他の多くの惑星と逆（東から西）なのも特徴です。' },
  { id: 'b_earth', category: 'planets', name: 'ちきゅう バッジ', emoji: '🌍', color: '#4cc9f0', desc: 'ぼくたちが すんでいる、おみずと みどりの うつくしい ほし！', image: '/assets/images/quiz/earth.png', detailDesc: '水と酸素に恵まれ生命が存在する太陽系唯一の惑星。約46億年前に誕生し、表面の70%以上が美しい海でおおわれています。' },
  { id: 'b_moon', category: 'planets', name: 'つき バッジ', emoji: '🌙', color: '#ffd166', desc: 'よるに ちきゅうを やさしく てらす、いちばん ちかい おともだちの ほし！', image: '/assets/images/quiz/moon.png', detailDesc: '地球から約38万km離れた唯一の天然の衛星。1969年アポロ11号が初めて着陸しました。自転と公転の周期が同じため、常に同じ面を地球に向けています。' },
  { id: 'b_mars', category: 'planets', name: 'かせい バッジ', emoji: '🔴', color: '#ef476f', desc: 'あかい いしや スナに おおわれた、ちきゅうの すぐ おとなりの ほし！', image: '/assets/images/quiz/mars.png', detailDesc: '土に含まれる酸化鉄（鉄サビ）で赤く見える惑星。太陽系最大の火山「オリンポス山（標高約25km）」や巨大な峡谷が存在します。' },
  { id: 'b_jupiter', category: 'planets', name: 'もくせい バッジ', emoji: '🪵', color: '#c5a059', desc: 'たいようけいで いちばん おおきい、ガスでできた ぐるぐるもようの ほし！', image: '/assets/images/quiz/jupiter.png', detailDesc: '地球が約1300個も入る太陽系最大の木星。ほとんどが水素とヘリウムのガスでできており、表面には地球より大きな大赤斑（台風）があります。' },
  { id: 'b_saturn', category: 'planets', name: 'どせい バッジ', emoji: '🪐', color: '#ffd166', desc: 'こおりや いしでできた、きれいな わ（リング）を もつ ほし！', image: '/assets/images/quiz/saturn.png', detailDesc: '無数の氷や岩石の粒が集まってできた巨大で美しい輪（リング）が特徴。密度が水より軽いため、もし巨大なプールがあれば水に浮きます！' },
  { id: 'b_uranus', category: 'planets', name: 'てんのうせい バッジ', emoji: '🌀', color: '#4cc9f0', desc: 'ひえひえの つめたい ほしで、よこだおしになって まわっているよ！', detailDesc: '自転軸が約98度も傾いており、ほぼ横倒しの状態で太陽の周りを自転しています。大気中のメタンガスによって美しい青緑色に見えます。' },
  { id: 'b_neptune', category: 'planets', name: 'かいおうせい バッジ', emoji: '🔵', color: '#118ab2', desc: 'たいようから いちばん とおい、あおい あらしの ふく ほし！', detailDesc: '太陽系最遠の第8惑星。時速2000kmを超える超高速の暴風が吹き荒れており、神秘的な深い青色が特徴です。' },
  { id: 'b_pluto', category: 'planets', name: 'めいおうせい バッジ', emoji: '❄️', color: '#b5e2fa', desc: 'ちいさくて つめたい ほし。じめんに ハートの もようがあるよ！', detailDesc: 'かつて第9惑星とされていましたが、2006年に準惑星へ分類変更されました。表面には窒素の氷でできた大きなハート型の明るい地域があります。' },
  { id: 'b_ceres', category: 'planets', name: 'ケレス バッジ', emoji: '🪨', color: '#6c757d', desc: 'かせいと もくせいの あいだにある、いちばん おおきな じゅんわくせい！', detailDesc: '火星と木星の間にある小惑星帯（アステロイドベルト）で最初に発見された天体。直径約950kmあり、内部に水や氷が存在すると考えられています。' },
  { id: 'b_eris', category: 'planets', name: 'エリス バッジ', emoji: '🧊', color: '#a2d2ff', desc: 'めいおうせいより とおい ばしょにある、こおりの じゅんわくせい！', detailDesc: '冥王星の外側で発見された氷の準惑星。冥王星とほぼ同じ大きさがあり、惑星の定義が見直されるきっかけとなりました。' },
  { id: 'b_haumea', category: 'planets', name: 'ハウメア バッジ', emoji: '🥚', color: '#e9ecef', desc: 'ラグビーボールのような タマゴのかたちをした、おもしろい ほし！', detailDesc: '自転速度が約4時間と極めて高速なため、遠心力でラグビーボールのように横に細長く引き伸ばされたユニークな形の準惑星です。' },
  { id: 'b_makemake', category: 'planets', name: 'マケマケ バッジ', emoji: '🟤', color: '#b5838d', desc: 'めいおうせいの すぐちかくを まわる、あかい こおりの ほし！', detailDesc: 'イースター島の創造神から名付けられた準惑星。極低温の表面はメタンやエタンの氷でおおわれ、赤みがかった色をしています。' },
  { id: 'b_halley', category: 'planets', name: 'ハレーほうきぼし', emoji: '☄️', color: '#a2d2ff', desc: '76ねんに いちどだけ ちきゅうに ちかづく、しっぽのある ほうきぼし！', detailDesc: '約76年の周期で地球に近づく最も有名な短周期彗星。太陽に近づくと氷が蒸発して、数百万kmにもおよぶ美しいガスと塵の尾を引きます。' },
  { id: 'b_great_red_spot', category: 'planets', name: '大せきはん バッジ', emoji: '🌀', color: '#e63946', desc: 'もくせいにある、ちきゅうが すっぽり入る くらい おおきな 赤いあらし！', detailDesc: '木星の南半球にある巨大な高気圧の渦。少なくとも350年以上消えずに渦巻き続けており、風速は時速400kmを超えます。' },
  { id: 'b_cassini_division', category: 'planets', name: 'カッシーニのすきま', emoji: '🍩', color: '#4a4e69', desc: 'どせいの わ（リング）にある、すきまの なまえだよ！', detailDesc: '土星のA環とB環の間にある幅約4800kmの黒い隙間。1675年に天文学者カッシーニが発見し、衛星ミマスの重力の影響でできたと考えられています。' },
  { id: 'b_earth_ocean', category: 'planets', name: 'あおいうみ バッジ', emoji: '🌊', color: '#0077b6', desc: 'ちきゅうの ひょうめんの ほとんどをおおう、ひろい おみずの エリア！', detailDesc: '地球の表面積の約70.8%をおおう広大な海。豊富な液体状の水が存在することが、地球上に多様な生命を育んだ最大の理由です。' },
  { id: 'b_mars_sand', category: 'planets', name: 'あかいスナ バッジ', emoji: '🏜️', color: '#e59866', desc: 'かせいの じめんをおおう、てつの さびが まざった あかいスナ！', detailDesc: '火星の土に含まれる酸化鉄（鉄サビ）で赤く見える砂塵。強風が吹くと、火星全体を覆う巨大な砂嵐が発生します。' },
  { id: 'b_lunar_crater', category: 'planets', name: 'つきのあな バッジ', emoji: '🕳️', color: '#bdc3c7', desc: 'いし（いんせき）が ぶつかってできた、つきの じめんの デコボコ！', detailDesc: '数億年にわたり彗星や小惑星が衝突してできたクレーター。月には風や雨がないため、何十億年前の衝突の跡が風化せずにそのまま残っています。' },
  { id: 'b_solar_flare', category: 'planets', name: 'フレア バッジ', emoji: '💥', color: '#ff4d6d', desc: 'たいようの ひょうめんで おこる、ものすごい 大ばくはつ！', detailDesc: '太陽の黒点付近で磁気エネルギーが解放される爆発現象。水爆数百億個分の大爆発を起こし、地球に強烈なオーロラをもたらします。' },
  { id: 'b_jupiter_stripe', category: 'planets', name: 'もくせい しましま', emoji: '🦓', color: '#d5a6bd', desc: 'もくせいの はやい かぜが つくりだす、きれいな しまもよう！', detailDesc: '高速な自転と強風によって、成分の異なるアンモニア雲が引っ張られてできた模様。明るい帯と暗い縞が交互に並んでいます。' },
  { id: 'b_saturn_ring', category: 'planets', name: 'どせいのわ バッジ', emoji: '⭕', color: '#f9d71c', desc: 'どせいの まわりを 高そくで まわる、こおりの つぶの あまとめ！', detailDesc: '厚さはわずか数十メートルですが、幅は28万kmにも及びます。99%以上が純粋な水の氷の粒から構成されています。' },
  { id: 'b_uranus_tilt', category: 'planets', name: 'よこだおし バッジ', emoji: '🛌', color: '#70d6ff', desc: 'てんのうせいが コロコロ ころがるように まわっている ふしぎなすがた！', detailDesc: '大昔に地球サイズの巨大天体が衝突したことで自転軸が約98度横倒しになったと推測されており、ゴロゴロ転がるように自転しています。' },
  { id: 'b_blue_storm', category: 'planets', name: 'あおいあらし バッジ', emoji: '🌪️', color: '#03045e', desc: 'かいおうせいにある、ちきゅうと おなじ大きさの つよい風のあらし！', detailDesc: '大暗斑と呼ばれる海王星の超巨大嵐。時速2000kmを超える太陽系最速の暴風が吹き荒れており、数年ごとに現れたり消えたりします。' },

  // 🚀 2. のりものエリア (25個)
  { id: 'b_rocket', category: 'vehicles', name: 'ロケット バッジ', emoji: '🚀', color: '#ffb703', desc: 'うちゅうへ とびたつ、かっこいい のりもの！', image: '/assets/images/quiz/rocket_h3.png', detailDesc: '大気圏を突き抜けて宇宙空間へ人工衛星や宇宙飛行士を届ける機体。日本のH3ロケットや巨大なSLSロケットなどが活躍中！' },
  { id: 'b_ufo', category: 'vehicles', name: 'UFO バッジ', emoji: '🛸', color: '#66fcf1', desc: 'うちゅうじんが のっているかも しれない、なぞの ひこうたい！', detailDesc: '未確認飛行物体（Unidentified Flying Object）の略。広大な宇宙のどこかに地球外生命体の乗り物が存在するのではないかというロマンです。' },
  { id: 'b_space_shuttle', category: 'vehicles', name: 'シャトル バッジ', emoji: '🛩️', color: '#e9ecef', desc: 'なんども うちゅうと ちきゅうを おうふくした、うちゅうひこうき！', detailDesc: '1981年から2011年まで活躍したアメリカの再利用型宇宙船。ハッブル宇宙望遠鏡の設置や宇宙ステーションの建設で大活躍しました！' },
  { id: 'b_iss', category: 'vehicles', name: 'ISS バッジ', emoji: '🛰️', color: '#b5e2fa', desc: 'ちきゅうの まわりを まわる、うちゅうひこうしさんが くらす しせつ！', image: '/assets/images/quiz/iss.png', detailDesc: '地上約400km上空を時速28,000km（約90分で地球1周）で飛行する巨大実験室。世界各国の宇宙飛行士が協力して暮らしています。' },
  { id: 'b_lunar_rover', category: 'vehicles', name: 'つきのくるま バッジ', emoji: '🏎️', color: '#8a8a8a', desc: 'つきの じめんを はしるために つくられた、とくべつな くるま！', image: '/images/p_lunar_rover.png', detailDesc: 'アポロ計画（15〜17号）で月面に持ち込まれた2人乗りの電動探査車（LRV）。宇宙飛行士が広大なエリアを探索するのに役立ちました！' },
  { id: 'b_sputnik', category: 'vehicles', name: 'スプートニク', emoji: '📡', color: '#ced4da', desc: 'にんげんが はじめて うちゅうに おくった、ちいさな じんこうえいせい！', detailDesc: '1957年10月4日にソ連が打ち上げた世界最初の人工衛星スプートニク1号。宇宙時代の始まりを告げる歴史的な球形衛星です。' },
  { id: 'b_voyager', category: 'vehicles', name: 'ボイジャー バッジ', emoji: '🛸', color: '#ffd166', desc: 'たいようけいの はてまで たびをつづける、でんせつの たんさき！', image: '/images/p_voyager.png', detailDesc: '1977年に打ち上げられ木星や土星を探査。現在は太陽圏を飛び出し、地球から最も遠い人工物としてレコード盤を乗せて宇宙を航海中！' },
  { id: 'b_hayabusa', category: 'vehicles', name: 'はやぶさ バッジ', emoji: '🦅', color: '#4cc9f0', desc: 'イトカワ という 小わくせいから、いしを もちかえった 日本のたんさき！', detailDesc: '2010年、数々の故障や困難を乗り越えて小惑星イトカワからサンプルを無事地球へ持ち帰った感動の日本探査機！' },
  { id: 'b_hayabusa2', category: 'vehicles', name: 'はやぶさ２ バッジ', emoji: '🛰️', color: '#52b788', desc: 'リュウグウ という 小わくせいから、スナを もちかえった たんさき！', image: '/images/p_hayabusa2.png', detailDesc: '小惑星リュウグウで人工クレーターを作り、地下のサンプルを採取して2020年に地球へ見事持ち帰った日本の探査機！' },
  { id: 'b_hubble', category: 'vehicles', name: 'ハッブル バッジ', emoji: '🔭', color: '#a2d2ff', desc: 'うちゅうを とびながら とおくの ほしを かんさつする ぼうえんきょう！', image: '/images/p_hubble.png', detailDesc: '1990年に打ち上げられた宇宙望遠鏡。地上大気の邪魔を受けず、数々の美しい銀河や宇宙の膨張速度の測定に貢献しました。' },
  { id: 'b_jwst', category: 'vehicles', name: 'ウェッブ バッジ', emoji: '👁️', color: '#ffb703', desc: 'きんいろの かがみを もつ、さいしんえいの うちゅうぼうえんきょう！', image: '/images/p_jwst.png', detailDesc: '主鏡直径6.5mの金メッキ鏡と赤外線カメラで、宇宙誕生直後の最初の星（ファーストスター）や遠くの惑星の大気を調べています。' },
  { id: 'b_artemis', category: 'vehicles', name: 'アルテミス バッジ', emoji: '🏹', color: '#ef476f', desc: 'ふたたび 月に にんげんを おくるための、おおかた ロケット！', image: '/images/p_artemis.png', detailDesc: 'アポロ計画以来となる人類の月面再着陸、そして将来の火星探査を目指す国際協力による国際宇宙探査計画プロジェクト！' },
  { id: 'b_starship', category: 'vehicles', name: 'スターシップ', emoji: '🚀', color: '#e9ecef', desc: 'たくさんの 人を 火せいにおくるために つくられている 巨大ロケット！', detailDesc: 'スペースX社が開発中の完全再利用可能な超大型宇宙船。最大100人の乗客を乗せて地球・月・火星間を大量輸送することを目指す未来の宇宙船です。' },
  { id: 'b_sls', category: 'vehicles', name: 'SLS バッジ', emoji: '🔥', color: '#fb8500', desc: 'アルテミスけいかくで つかわれた、ものすごい パワーの ロケット！', detailDesc: 'NASAが開発した超大型有人打ち上げロケット（Space Launch System）。サターンVを超える推力でアルテミス計画の月探査船を打ち上げます。' },
  { id: 'b_apollo11', category: 'vehicles', name: 'アポロ11ごう', emoji: '🌕', color: '#ffd166', desc: 'はじめて にんげんを 月へ つれていった、でんせつの うちゅうせん！', detailDesc: '1969年7月20日、アームストロング船長とオルドリン飛行士を乗せて月面「静かの海」に降り立ち、人類初の月面着陸を達成した歴史的宇宙船。' },
  { id: 'b_kibou', category: 'vehicles', name: 'きぼう バッジ', emoji: '🎌', color: '#ef476f', desc: 'ISS（宇宙ステーション）にある、日本の じっけんスペース！', detailDesc: '国際宇宙ステーション（ISS）における日本独自の有人実験モジュール。船外実験プラットフォームを備え、創薬や新材料開発の先端実験を行っています。' },
  { id: 'b_curiosity', category: 'vehicles', name: 'キュリオシティ', emoji: '🤖', color: '#8a8a8a', desc: 'かせいの じめんを 走りながら、水や 生きもののあとを さがすロボ！', detailDesc: '2012年に火星に着陸した大型火星探査車。ドリルで岩石を掘削し、かつて古代火星に淡水湖が存在した科学的証拠を発見しました。' },
  { id: 'b_perseverance', category: 'vehicles', name: 'パーシビアランス', emoji: '📸', color: '#ffb703', desc: 'かせいで 音をろくおんしたり、ヘリコプターを とばした 最新ロボ！', detailDesc: '2021年に火星に着陸。古代生命の痕跡（バイオシグネチャー）の採取と、将来地球へ持ち帰るためのサンプル保管を担当中。' },
  { id: 'b_ingenuity', category: 'vehicles', name: 'インジェニュイティ', emoji: '🛸', color: '#52b788', desc: 'ちきゅう 以外の ほし（かせい）で、はじめて とんだ ヘリコプター！', detailDesc: '地球の1%以下の薄い火星大気中において、二重反転ローターを高速回転させて大空を舞った、人類史上初となる地球外動力飛行成功機。' },
  { id: 'b_pioneer10', category: 'vehicles', name: 'パイオニア バッジ', emoji: '🛰️', color: '#a2d2ff', desc: 'うちゅうじんへの メッセージばんを のせて とぶ、ふるいたんさき！', detailDesc: '1972年に打ち上げられ小惑星帯を初めて突破した無人探査機。地球の位置や人間を描いた金メッキの金属板（メッセージプレート）を搭載。' },
  { id: 'b_cassini', category: 'vehicles', name: 'カッシーニ バッジ', emoji: '🪐', color: '#c5a059', desc: 'どせいの わ（リング）や 衛星を たくさんかんさつした たんさき！', detailDesc: '2004年から2017年まで土星を詳細観測。土星の環の複雑な構造を明らかにし、衛星タイタンへの探査機ホイヘンス投下、エンケラドスの海水噴出を発見。' },
  { id: 'b_new_horizons', category: 'vehicles', name: 'ニューホライズンズ', emoji: '🌌', color: '#4cc9f0', desc: 'めいおうせいの ちかくを とおりすぎ、ハートもようを 見つけた探さき！', detailDesc: '2015年7月に時速5万km以上の猛スピードで冥王星を近接通過。美しい窒素氷のハート型平原「スプートニク平原」を鮮明に撮影しました。' },
  { id: 'b_space_suit', category: 'vehicles', name: 'うちゅうふく', emoji: '🧑‍🚀', color: '#e9ecef', desc: 'さむくて 空気のない うちゅうで、からだをまもる とくべつなふく！', detailDesc: 'マイナス150度からプラス120度におよぶ激しい温度差と極限の真空から体を保護し、純酸素の供給や体温調節を行う、一着数億円以上の生命維持装置。' },
  { id: 'b_capsule', category: 'vehicles', name: 'カプセル バッジ', emoji: '☄️', color: '#4cc9f0', desc: '小わくせいのスナを入れて、ちきゅうに とどけた たからばこ！', detailDesc: '「はやぶさ」や「はやぶさ2」が小惑星で採取した貴重なサンプルを納め、大気圏再突入時の3000度の灼熱から内部を無傷で守る超強力耐熱カプセル。' },
  { id: 'b_pencil_rocket', category: 'vehicles', name: 'ペンシルロケット', emoji: '✏️', color: '#8a8a8a', desc: '日本の うちゅう開発のはじまりとなった、えんぴつサイズのロケット！', detailDesc: '1955年に糸川英夫博士らが開発した全長わずか23cmの超小型ロケット。日本の宇宙工学の輝かしい発祥点です。' },

  // 🛰️ 3. たんさき・えいせいエリア (26個)
  { id: 'b_phobos', category: 'satellites', name: 'フォボス バッジ', emoji: '🥔', color: '#b5838d', desc: 'かせいの まわりをまわる、ジャガイモのような かたちの 小さな衛星！', detailDesc: '火星の第1衛星。直径約22kmで、火星の表面からわずか6000kmという極めて近い軌道を約7時間39分で公転しています。' },
  { id: 'b_deimos', category: 'satellites', name: 'ダイモス バッジ', emoji: '🪨', color: '#a0a5c0', desc: 'フォボスと いっしょに かせいを まわる、でこぼこの ちいさな衛星！', detailDesc: '火星の第2衛星。平均直径約12kmの極小天体で、太古に火星の重力に捕らえられた小惑星だと考えられています。' },
  { id: 'b_io', category: 'satellites', name: 'イオ バッジ', emoji: '🌋', color: '#fb8500', desc: 'もくせいの まわりを まわる、かざんが いっぱいある カラフルな衛星！', detailDesc: '木星の潮汐力による強力な摩擦熱で、400以上の活性火山が存在する太陽系で最も火山活動が激しい衛星です。' },
  { id: 'b_europa', category: 'satellites', name: 'エウロパ バッジ', emoji: '🧊', color: '#b5e2fa', desc: 'ひょうめんが こおりでおおわれ、なかに 海があるかも しれない衛星！', detailDesc: '分厚い氷の地殻の下に、地球の海以上の水量を誇る巨大な内部海（地下海洋）が存在し、生命が存在する可能性が高く注目されています。' },
  { id: 'b_ganymede', category: 'satellites', name: 'ガニメデ バッジ', emoji: '🌌', color: '#8a8a8a', desc: 'たいようけいの 衛星のなかで、いちばん おおきな衛星（水星より大きい）！', detailDesc: '直径5268kmと水星や冥王星よりも大きい太陽系最大の衛星。固有の磁場を持つ唯一の衛星でもあります。' },
  { id: 'b_callisto', category: 'satellites', name: 'カリスト バッジ', emoji: '☄️', color: '#4a4e69', desc: 'クレーター（いんせきのあと）が いちばん たくさんある もくせいの衛星！', detailDesc: '太陽系で最もクレーター密度が高い古い表面を持つ木星の衛星。氷と岩石が半々で混ざり合った構造をしています。' },
  { id: 'b_titan', category: 'satellites', name: 'タイタン バッジ', emoji: '🌫️', color: '#ffb703', desc: 'あつい空気におおわれ、オレンジ色のガスにつつまれて、川がある衛星！', detailDesc: '太陽系で唯一、分厚い窒素大気と液体メタンの雨や川・湖を持つ衛星。探査機ホイヘンスが着陸に成功しました。' },
  { id: 'b_enceladus', category: 'satellites', name: 'エンケラドゥス', emoji: '⛲', color: '#a2d2ff', desc: 'こおりの すきまから、おみずの温泉（おんせん）を ふきだしている衛星！', detailDesc: '南極付近の氷の亀裂から水蒸気や有機物を含む間欠泉が宇宙空間へ吹き出しており、内部海に熱水噴出孔があると推測されています。' },
  { id: 'b_mimas', category: 'satellites', name: 'ミマス バッジ', emoji: '👁️', color: '#ced4da', desc: 'スター・ウォーズのでっかい宇宙船（デス・スター）にそっくりな衛星！', detailDesc: '巨大なハーシェル・クレーターが存在し、その姿が映画スター・ウォーズのデス・スターにそっくりな土星の衛星です。' },
  { id: 'b_charon', category: 'satellites', name: 'カロン バッジ', emoji: '🌑', color: '#4a4e69', desc: 'めいおうせいと ほぼおなじ大きさで、お互いに見つめ合ってまわる衛星！', detailDesc: '冥王星の半分以上の大きさを持つ超巨大な衛星。お互いの重心を中心に二重惑星のように同じ面を向け合って回転しています。' },
  { id: 'b_philae', category: 'satellites', name: 'フィラエ バッジ', emoji: '🦗', color: '#52b788', desc: 'ほうきぼしの ひょうめんに、はじめて 着りくした 小さなたんさ機！', detailDesc: '探査機ロゼッタから切り離され、2014年にチュリュモフ・ゲラシメンコ彗星の核へ史上初めて着陸に成功した小型着陸機。' },
  { id: 'b_rosetta', category: 'satellites', name: 'ロゼッタ バッジ', emoji: '🛰️', color: '#a2d2ff', desc: 'ほうきぼしに ピッタリよりそって、ずっと かんさつをつづけた探さき！', detailDesc: '欧州宇宙機関（ESA）の彗星探査機。彗星の周回軌道上に2年間留まり、彗星の有機物や水蒸気の噴出メカニズムを解明しました。' },
  { id: 'b_triton', category: 'satellites', name: 'トリトン バッジ', emoji: '❄️', color: '#70d6ff', desc: 'ほかの衛星とは はんたいのむきに まわっている、つめたい衛星！', detailDesc: '海王星の巨大衛星。大きな衛星の中で唯一、公転方向が逆向きの「逆行衛星」であり、窒素ガスが爆発的に噴き出す地圧噴出が見られます。' },
  { id: 'b_titania', category: 'satellites', name: 'チタニア バッジ', emoji: '💎', color: '#e9ecef', desc: 'てんのうせいの まわりをまわる、いちばん おおきな こおりの衛星！', detailDesc: '天王星最大（直径約1578km）の衛星。水氷と岩石で構成され、表面には巨大な断崖や峡谷（大断層）が存在します。' },
  { id: 'b_oberon', category: 'satellites', name: 'オベロン バッジ', emoji: '⛰️', color: '#8a8a8a', desc: 'てんのうせいの衛星で、山や クレーターがいっぱいある ごつごつしたほし！', detailDesc: '天王星の最外郭を回る第2の大衛星。クレーターが極めて多く古く、高さ20kmを超える太陽系有数の高山が存在します。' },
  { id: 'b_phobos_crater', category: 'satellites', name: 'スティックニー', emoji: '🎯', color: '#b5838d', desc: 'フォボスの ひょうめんにある、フォボスそのものと同じくらい巨大なクレーター！', detailDesc: '火星の衛星フォボスにある直径9kmの超巨大クレーター。この衝突の衝撃でフォボス全体が破壊寸前まで砕けたと考えられています。' },
  { id: 'b_akatsuki', category: 'satellites', name: 'あかつき バッジ', emoji: '🎌', color: '#ffb703', desc: 'きんせいの まわりをまわり、あつい雲のうごきをしらべる 日本の探さき！', detailDesc: '一度軌道投入に失敗したものの5年後に見事金星周回軌道へ復活投入された感動の日本探査機。金星のスーパーローテーション（超風）を解析中。' },
  { id: 'b_kaguya', category: 'satellites', name: 'かぐや バッジ', emoji: '🎌', color: '#ffd166', desc: 'つきの ひょうめんを ハイビジョンカメラできれいにさつえいした探さき！', detailDesc: '2007年打ち上げ。NHKの超HDカメラで「満ちてくる地球（地球の出）」の撮影に成功し、月探査に世界的な金字塔を打ち立てました。' },
  { id: 'b_parker', category: 'satellites', name: 'パーカー バッジ', emoji: '🔥', color: '#fb8500', desc: 'たいように いちばん ちかくまで行って、あつい風を調べる熱いつよい探さき！', detailDesc: '太陽の outermost 大気「コロナ」の中に直接飛び込む史上初の探査機。厚い炭素複合材シールドで1300度以上の熱に耐えています。' },
  { id: 'b_juno', category: 'satellites', name: 'ジュノー バッジ', emoji: '🪐', color: '#8a8a8a', desc: 'もくせいの ガスにつつまれた中を調べるために、すぐそばをまわる探さき！', detailDesc: '木星の強力な放射線帯に耐えるチタン製金庫室を備え、巨大な極熱オーロラや木星内部に存在する巨大な核心（コア）を解明中。' },
  { id: 'b_mir', category: 'satellites', name: 'ミール バッジ', emoji: '🚀', color: '#b5e2fa', desc: 'ロシアがつくり、むかし うちゅうひこうしさんが 長くくらした宇宙ステーション！', detailDesc: 'ソ連・ロシアが建設した世界初のモジュール型宇宙ステーション。15年間にわたり宇宙飛行士の長期滞在記録を次々と樹立しました。' },
  { id: 'b_skylab', category: 'satellites', name: 'スカイラブ', emoji: '🏗️', color: '#ced4da', desc: 'アメリカが はじめて つくった、しょだいの 宇宙ステーション！', detailDesc: 'アポロ計画の余剰資材を活用して1973年に打ち上げられたアメリカ初の宇宙ステーション。太陽観測や微小重力実験を行いました。' },
  { id: 'b_luna3', category: 'satellites', name: 'ルナ3ごう', emoji: '📷', color: '#8a8a8a', desc: 'ちきゅうからは 絶対に見えない「月のうらがわ」を はじめて撮影した探さき！', detailDesc: '1959年にソ連が打ち上げた月探査機。自転と公転の一致により地球から隠されていた「月の裏側」の写真撮影に人類史上初めて成功しました。' },
  { id: 'b_pioneer_venus', category: 'satellites', name: 'パイオニア金星', emoji: '✨', color: '#ffb703', desc: 'きんせいの あつい雲の下に レーダーをとおして 地形を調べた探さき！', detailDesc: '1978年に金星へ到着。分厚い硫酸雲を透過するレーダー高度計で、金星全体の広大な山脈や高原の立体地図を初めて描きました。' },
  { id: 'b_luna16', category: 'satellites', name: 'ルナ16ごう', emoji: '🚜', color: '#8a8a8a', desc: 'にんげんが乗らない ロボットだけで、つきのいしを持ってかえってきた探さき！', detailDesc: '1970年、全自動ロボットアームで月の「豊かの海」の月サンプルをドリル掘削し、地球への自動回収カプセルで持ち帰ることに世界初成功。' },
  { id: 'b_mio', category: 'satellites', name: 'みお バッジ', emoji: '🎌', color: '#66fcf1', desc: 'すいせいを調べるために、日本のロケットでとびたった 日欧きょうどうの探さき！', detailDesc: '日本のJAXAが開発した水星磁気圏探査機（MMO）。自転しながら水星の固有磁場やプラズマ環境を精密測定します。' },

  // 🔭 4. てんもんがくしゃエリア (25個)
  { id: 'b_galileo', category: 'astronomers', name: 'ガリレオ バッジ', emoji: '🔭', color: '#c5a059', desc: 'はじめて ぼうえんきょうを 夜空にむけて、もくせいの衛星や月のデコボコを見つけた人！', image: '/assets/images/badges/galileo.png', detailDesc: 'ガリレオ・ガリレイ（1564-1642）。望遠鏡を夜空に向け木星の4つの衛星（ガリレオ衛星）や月のクレーターを発見。「それでも地球は回っている」で知られる地動説の擁護者です。' },
  { id: 'b_copernicus', category: 'astronomers', name: 'コペルニクス', emoji: '🧭', color: '#ffd166', desc: 'ちきゅうではなく、「たいようが まんなかに ある」とはじめて言った人！', image: '/assets/images/badges/copernicus.png', detailDesc: 'ニコラウス・コペルニクス（1473-1543）。太陽を中心に地球や惑星が回っているという「天体運行論（地動説）」を発表し、現代天文学の扉を開きました。' },
  { id: 'b_kepler', category: 'astronomers', name: 'ケプラー バッジ', emoji: '🌀', color: '#4cc9f0', desc: 'わくせいが 円（まる）ではなく、すこし つぶれただ円の形でまわる法則を見つけた人！', detailDesc: 'ヨハネス・ケプラー（1571-1630）。観測データから「ケプラーの３法則」を発見し、惑星が太陽を一つの焦点とする楕円軌道を描いて回ることを示しました。' },
  { id: 'b_newton', category: 'astronomers', name: 'ニュートン', emoji: '🍎', color: '#ef476f', desc: 'リンゴが落ちるのをみて、ひっぱる力「じゅうりょく（重力）」を見つけた人！', image: '/assets/images/badges/newton.png', detailDesc: 'アイザック・ニュートン（1643-1727）。万有引力の法則を発見し、天体の運動を万有引力と力学で数学的に証明した近代科学の父。' },
  { id: 'b_einstein', category: 'astronomers', name: 'アインシュタイン', emoji: '👅', color: '#b5e2fa', desc: 'じゅうりょくは 宇宙の「ゆがみ」である、という 相対性理論をかんがえた天才学者！', image: '/assets/images/badges/einstein.png', detailDesc: 'アルベルト・アインシュタイン（1879-1955）。相対性理論を発表し、時間と空間が歪むことや重力レンズ効果、ブラックホールの存在を予言した20世紀最大の天才物理学者。' },
  { id: 'b_edwin_hubble', category: 'astronomers', name: 'ハッブルはかせ', emoji: '🌌', color: '#a2d2ff', desc: '宇宙には 天の川のほかにも 銀河がたくさんあり、宇宙がどんどん膨らんでいるのを見つけた人！', detailDesc: 'エドウィン・ハッブル（1889-1953）。アンドロメダ銀河が天の川の外にあることを証明し、遠くの銀河ほど速く遠ざかっている（宇宙膨張）を発見。' },
  { id: 'b_sagan', category: 'astronomers', name: 'セーガンはかせ', emoji: '📺', color: '#52b788', desc: 'テレビや本で、宇宙のロマンや「宇宙人さがし」を楽しくみんなに伝えた学者さん！', detailDesc: 'カール・セーガン（1934-1996）。科学番組『コスモス』の進行役として世界中に宇宙の魅力を発信。ボイジャーの黄金レコードの制作をリード。' },
  { id: 'b_hawking', category: 'astronomers', name: 'ホーキング博士', emoji: '♿', color: '#8a8a8a', desc: 'ブラックホールが すこしずつ 蒸発（じょうはつ）して消えていくことを発表した学者さん！', detailDesc: 'スティーヴン・ホーキング（1942-2018）。車椅子の天才物理学者。熱力学と量子力学を融合し「ブラックホール蒸発理論（ホーキング放射）」を提唱。' },
  { id: 'b_herschel', category: 'astronomers', name: 'ハーシェル バッジ', emoji: '🪐', color: '#70d6ff', desc: 'じぶんの手づくりの ぼうえんきょうで、「てんのうせい」を発見したイギリスの人！', detailDesc: 'ウィリアム・ハーシェル（1738-1822）。自作の大望遠鏡で1781年に天王星を発見。赤外線の発見や銀河系の形を初めて推測した偉人です。' },
  { id: 'b_tombaugh', category: 'astronomers', name: 'トンボー バッジ', emoji: '❄️', color: '#b5e2fa', desc: '写真を見くらべる ねばりづよい ほうほうで、「めいおうせい」を発見した人！', detailDesc: 'クライド・トンボー（1906-1997）。1930年、数百万の星が映った写真プレートを「瞬き比較器」で根気よく見比べ、冥王星を発見した若き天文学者。' },
  { id: 'b_ptolemy', category: 'astronomers', name: 'プトレマイオス', emoji: '📜', color: '#c5a059', desc: 'むかしのローマで、地球のまわりを星がまわる「天動説」をまとめた古代の学者！', detailDesc: 'クラウディオス・プトレマイオス（約100-170）。古代ギリシャ・ローマの天文学を集大成した大著『アルマゲスト』を著し、1400年間天動説を支えました。' },
  { id: 'b_bruno', category: 'astronomers', name: 'ブルーノ バッジ', emoji: '🕯️', color: '#ff4d6d', desc: '「宇宙にはちきゅうと同じような星が無数にあり、宇宙人はいる」と言い張って処刑された人！', detailDesc: 'ジョルダーノ・ブルーノ（1548-1600）。太陽も無数の星の一つであり、宇宙は無限で他の星にも生命が存在すると訴え、持論を曲げずに殉教した思想家。' },
  { id: 'b_brahe', category: 'astronomers', name: 'ティコ・ブラーエ', emoji: '📐', color: '#ffd166', desc: 'ぼうえんきょうができる前に、ものすごい正確さで星のうごきを目で記録しつづけた人！', detailDesc: 'ティコ・ブラーエ（1546-1601）。望遠鏡発明以前の時代に、肉眼で極めて高精度な惑星軌道観測データを残し、ケプラーの偉大な法則発見の基盤を作りました。' },
  { id: 'b_halley_person', category: 'astronomers', name: 'ハレーはかせ', emoji: '☄️', color: '#a2d2ff', desc: 'ほうきぼしの軌道を計算し、76年ごとに もどってくることを予言してあてた人！', detailDesc: 'エドモンド・ハレー（1656-1742）。1682年の彗星が過去の彗星と同体と見抜き、1758年に再出現することをニュートン力学で予言して見事的中させました。' },
  { id: 'b_leavitt', category: 'astronomers', name: 'レビット バッジ', emoji: '🕯️', color: '#ffb703', desc: '星がチカチカ明暗する周期から、その星までのきょりを測る方法を見つけた女性学者！', detailDesc: 'ヘンリエッタ・スワン・レビット（1868-1921）。変光星の周期と明るさの関係（周期-光度関係）を発見し、「宇宙の距離を測る物差し」を提供しました。' },
  { id: 'b_messier', category: 'astronomers', name: 'メシエ バッジ', emoji: '🌌', color: '#4cc9f0', desc: 'メシエカタログ（M1〜M110）をつくったフランスの彗星ハンター！', detailDesc: 'シャルル・メシエ（1730-1817）。彗星と紛らわしい星雲や星団をリスト化した「メシエカタログ（M1蟹星雲〜M31アンドロメダ銀河等）」を作成。' },
  { id: 'b_piazzi', category: 'astronomers', name: 'ピアッツィ', emoji: '🪨', color: '#6c757d', desc: '1801年の元旦に、はじめての小わくせい「ケレス」を発見したシチリアの神父さま！', detailDesc: 'ジュゼッペ・ピアッツィ（1746-1826）。1801年1月1日の夜、火星と木星の間の空白域で最初の小惑星ケレスを発見しました。' },
  { id: 'b_galle', category: 'astronomers', name: 'ガレ バッジ', emoji: '🔵', color: '#118ab2', desc: 'ルヴェリエの計算した予測位置をもとに、「かいおうせい」を初めて観測で発見した人！', detailDesc: 'ヨハン・ゴットフリート・ガレ（1812-1910）。ルヴェリエから届いた計算手紙のわずか1時間後、望遠鏡で計算通りの場所に海王星を発見しました。' },
  { id: 'b_le_verrier', category: 'astronomers', name: 'ルヴェリエ', emoji: '✏️', color: '#e9ecef', desc: '計算だけで海王星の位置をあてた、数学が得意なフランス of 天文学者！', image: '/assets/images/badges/le_verrier.png', detailDesc: 'ウルバン・ルヴェリエ（1811-1877）。天王星の軌道のズレから数学計算のみで未知の第8惑星（海王星）の位置を予測し見事発見に導いたフランスの天文学者。' },
  { id: 'b_lowell', category: 'astronomers', name: 'ローウェル', emoji: '🏜️', color: '#e59866', desc: '火星には運河があり火星人がいると信じ、冥王星の捜索も始めたアメリカの天文学者！', detailDesc: 'パーシヴァル・ローウェル（1855-1916）。ローウェル天文台を設立。火星の人工運河説を唱えたほか、第9惑星「惑星X（冥王星）」の捜索を開始しました。' },
  { id: 'b_asaph_hall', category: 'astronomers', name: 'アサフ・ホール', emoji: '🥔', color: '#b5838d', desc: '火星のちいさな２つの衛星「フォボス」と「ダイモス」を発見した天文学者！', detailDesc: 'アサフ・ホール（1829-1907）。1877年、大接近した火星のすぐ側にかすかに輝く2つの極小衛星フォボスとダイモスを発見しました。' },
  { id: 'b_payne', category: 'astronomers', name: 'ペイン博士', emoji: '☀️', color: '#fb8500', desc: 'たいようや星が「水素とヘリウム」のガスでできていることをつきとめた女性学者！', detailDesc: 'セシリア・ペイン＝ガポーシュキン（1900-1979）。太陽や恒星が主に水素とヘリウムで構成されていることを分光分析で初めて解明した天才天文学者。' },
  { id: 'b_bell_burnell', category: 'astronomers', name: 'ベル＝バーネル', emoji: '📻', color: '#66fcf1', desc: '規則正しい電波パルスをだす、中性子星（パルサー）を初めて見つけた女性！', detailDesc: 'ジョスリン・ベル＝バーネル（1943-）。1967年、1.33秒周期で規則正しい電波を発する超高速回転する中性子星「パルサー」を発見。' },
  { id: 'b_penrose', category: 'astronomers', name: 'ペンローズ', emoji: '📐', color: '#8a8a8a', desc: 'ブラックホールの中心に、密度が無限大になる「特異点」があることを数式で証明した人！', detailDesc: 'ロジャー・ペンローズ（1931-）。一般相対性理論からブラックホール形成が不可避であり中心に「特異点」が存在することを証明。2020年ノーベル物理学賞受賞。' },
  { id: 'b_nobel', category: 'astronomers', name: 'ノーベル賞バッジ', emoji: '🏅', color: '#ffd166', desc: 'ブラックホールや宇宙の加速膨張の発見など、宇宙の謎をといた人に送られる賞！', detailDesc: '物理学賞において、重力波の検出やアインシュタインの相対論の証明、宇宙マイクロ波背景放射の発見など宇宙科学の偉業に与えられる世界最高の栄誉。' },

  // 🌟 5. せいざ・うちゅうエリア (26個)
  { id: 'b_const_orion', category: 'space', name: 'オリオン座 バッジ', emoji: '🏹', color: '#4cc9f0', desc: 'ふゆの夜空にかがやく、３つのならんだ星（三ツ星）がめじるしの狩人の星座！', image: '/assets/images/quiz/orion.png', detailDesc: '冬の夜空で最も有名な星座。赤色超巨星ベテルギウスと青白色の1等星リゲル、中央の美しい3つ星が特徴。' },
  { id: 'b_const_dipper', category: 'space', name: '北斗七星 バッジ', emoji: '🥄', color: '#ffd166', desc: 'おおぐま座のしっぽにある、ひしゃくの形をした有名な７つの星のあまとめ！', detailDesc: 'おおぐま座の腰から尻尾を構成する7つの明るい星。先の2つの星（メラクとドゥーベ）を結んで5倍伸ばすと北極星が見つかる目印です。' },
  { id: 'b_const_cassiopeia', category: 'space', name: 'カシオペヤ座', emoji: '👑', color: '#b5e2fa', desc: 'アルファベットの「W」の形をした、秋の夜空の王妃さまの星座！', detailDesc: '秋から冬の北の空に輝く「W」の形をした目立つ星座。北斗七星と同じく北極星を探す重要なガイドラインとなります。' },
  { id: 'b_const_cygnus', category: 'space', name: 'はくちょう座', emoji: '🦢', color: '#e9ecef', desc: '夏の天の川のうえで、大きな十字架をえがいて飛ぶ白鳥の星座！', detailDesc: '夏の大三角を形作る1等星デネブを尾に持ち、天の川を南へ羽ばたく巨大な白鳥の姿。宮沢賢治の『銀河鉄道の夜』の発着駅でも有名。' },
  { id: 'b_const_scorpius', category: 'space', name: 'さそり座 バッジ', emoji: '🦂', color: '#ef476f', desc: '夏の南の空ひくくにかがやく、赤い心臓の星（アンタレス）をもつサソリの星座！', detailDesc: '夏の南の低空に大きなS字を描く美しく迫力ある星座。中心で不気味に赤く輝くアンタレスは「火星に対抗するもの」という意味を持ちます。' },
  { id: 'b_const_leo', category: 'space', name: 'しし座 バッジ', emoji: '🦁', color: '#fb8500', desc: 'はるの夜空をかける、ライオンの星座。クエスチョンマークの逆のような形がめじるし！', detailDesc: '春の代表的な星座。頭部の星並びは「ししの大鎌」と呼ばれ、胸元に青白色の1等星レグルスが力強く輝きます。' },
  { id: 'b_andromeda', category: 'space', name: 'アンドロメダ銀河', emoji: '🌀', color: '#a2d2ff', desc: 'ちきゅうから いちばん近い、２５0万光年かなたにある おおきなうずまき銀河！', detailDesc: 'M31と呼ばれる地球から約250万光年離れた巨大渦巻銀河。肉眼で見える最も遠い天体であり、約45億年後に我が天の川銀河と衝突・合体すると予測されています。' },
  { id: 'b_milky_way', category: 'space', name: '天の川 バッジ', emoji: '🌌', color: '#b5e2fa', desc: 'ぼくたちの太陽系もふくまれる、2000億個もの星が集まった巨大な銀河！', image: '/assets/images/quiz/milky_way.png', detailDesc: '私たちの太陽系が属する銀河系（ミルキーウェイ）。2000億個以上の恒星が渦巻き状に集まった巨大な星の集団です。' },
  { id: 'b_black_hole', category: 'space', name: 'ブラックホール', emoji: '🕳️', color: '#8a8a8a', desc: 'ものすごい重力で、光さえも吸い込んで逃げ出せなくしてしまう宇宙の穴！', detailDesc: '超高密度に圧縮された質量によって重力が極限まで高まり、光速でも脱出できなくなる時空の領域（事象の地平線）。中心には無限密度の特異点が存在。' },
  { id: 'b_big_bang', category: 'space', name: 'ビッグバン バッジ', emoji: '💥', color: '#ef476f', desc: '約138億年まえ、宇宙がうまれた瞬間の超巨大な大ばくはつ！', detailDesc: '約138億年前、超高温・超高密度の極小点から急激なインフレーション拡大を起こして宇宙が誕生した創世の大爆発現象。' },
  { id: 'b_supernova', category: 'space', name: '超新星爆発', emoji: '✨', color: '#ffd166', desc: '重い星が一生の終わりをむかえるときに、ものすごく明るく輝く大爆発！', detailDesc: '太陽の8倍以上の質量を持つ巨大な恒星が最期に起こす壊滅的爆発。銀河全体に匹敵する光を放ち、鉄より重い金やウランなどの元素を生み出します。' },
  { id: 'b_crab_nebula', category: 'space', name: 'かに星雲 バッジ', emoji: '🦀', color: '#ffb703', desc: '超新星爆発のガスが広がった天体。真ん中でパルサーが超高速で回転しているよ！', detailDesc: '1054年に地球から目撃された超新星爆発の残骸（M1）。中心には1秒間に約30回転する超高速中性子星（かにパルサー）が存在します。' },
  { id: 'b_aurora', category: 'space', name: 'オーロラ バッジ', emoji: '💚', color: '#52b788', desc: '太陽の電気が地球の空気にぶつかって、夜空にひらめく美しい光のカーテン！', detailDesc: '太陽風（荷電粒子）が地球の磁力線に沿って極地方へ降り注ぎ、高度100km付近の大気（酸素や窒素分子）を励起させて発光させる自然の神秘的な光景。' },
  { id: 'b_shooting_star', category: 'space', name: 'ながれ星 バッジ', emoji: '💫', color: '#ffd166', desc: '宇宙の小さなチリが地球の空気にぶつかり、一瞬で燃えつきながら光るもの！', detailDesc: '彗星などが撒き散らしたミリメートルサイズのミリダスト（宇宙塵）が時速数十キロで大気圏に入り、プラズマ発光して一瞬輝く現象。' },
  { id: 'b_const_aries', category: 'space', name: 'おひつじ座 バッジ', emoji: '🐏', color: '#ffd166', desc: '黄道十二星座の１つ。むかしのギリシャで、黄金の毛皮をもつ空飛ぶヒツジの星座！', detailDesc: '黄道十二星座の第1座。ギリシャ神話で子供たちを背に乗せて空を飛んだ黄金の羊の物語に由来します。' },
  { id: 'b_const_taurus', category: 'space', name: 'おうし座 バッジ', emoji: '🐂', color: '#c5a059', desc: '赤い巨大な目の星（アルデバラン）とすばるを背中にのせたオウシの星座！', detailDesc: '冬の夜空に輝く牡牛の姿。赤い1等星アルデバランや、青い星が集まった美しいプレアデス星団（すばる）を含んでいます。' },
  { id: 'b_const_gemini', category: 'space', name: 'ふたご座 バッジ', emoji: '👬', color: '#e9ecef', desc: 'カストルとポルックスという、仲良しのふたごの兄弟の星座！', image: '/assets/images/badges/gemini.png', detailDesc: '明るい1等星ポルックスと2等星カストルが並ぶ双子の星座。冬から春にかけて南の空高く見られます。' },
  { id: 'b_const_cancer', category: 'space', name: 'かに座 バッジ', emoji: '🦀', color: '#ef476f', desc: '勇者ヘラクレスとのたたかいのなかで、星座にあげてもらったカニの星座！', detailDesc: '黄道十二星座の一つ。中心には肉眼でもぼんやり見える美しいオープン星団「プレセペ星団（M44）」が包まれています。' },
  { id: 'b_const_libra', category: 'space', name: 'てんびん座 バッジ', emoji: '⚖️', color: '#52b788', desc: '正義の女神アストライアがかつて使っていた、善悪をはかる天秤の星座！', detailDesc: '黄道十二星座で唯一、生き物ではなく「道具」をモチーフにした星座。かつては秋分点が存在し昼と夜の長さを測る象徴でした。' },
  { id: 'b_const_sagittarius', category: 'space', name: 'いて座 バッジ', emoji: '🏹', color: '#a2d2ff', desc: '銀河系の中心の方向にある、半人半馬の賢者が弓をひく星座！', detailDesc: '天の川の最も濃い南の空に位置する半人半馬のケンタウロス族の弓引く姿。この星座の方向に我が天の川銀河の中心（Sgr A*）が存在します。' },
  { id: 'b_const_capricornus', category: 'space', name: 'やぎ座 バッジ', emoji: '🐐', color: '#8a8a8a', desc: '怪物から逃げるために、あわてて下半身を魚にした牧神パンの星座！', detailDesc: '上半身が山羊、下半身が魚という古代メソポタミア由来の極めて古い神話の姿を持つ秋の黄道星座。' },
  { id: 'b_const_aquarius', category: 'space', name: 'みずがめ座 バッジ', emoji: '🏺', color: '#4cc9f0', desc: '美少年が、神々のために「お酒と水」を注ぐ水がめをもつ星座！', detailDesc: '大きな水瓶から水が流れ出る姿を描いた秋の星座。みずがめ座η（エータ）流星群の放射点が存在します。' },
  { id: 'b_const_pisces', category: 'space', name: 'うお座 バッジ', emoji: '🐟', color: '#70d6ff', desc: 'リボンで結ばれた二匹の魚が、怪物から隠れて泳ぐ姿の星座！', detailDesc: '愛の女神アフロディーテとその子エロスが怪獣から逃げるため魚に化け、離れないよう紐で結んだ神話に基づく春分点を持つ星座。' },
  { id: 'b_dark_matter', category: 'space', name: '暗黒物質 バッジ', emoji: '🛸', color: '#4a4e69', desc: '目には見えないけれど、強い重力だけを放って宇宙を形作る謎の物質！', detailDesc: '光を放出も吸収もしないため見えませんが、質量と重力を持ち、宇宙全体の全物質の約85%を占める最大の未解明物質。' },
  { id: 'b_universe_expansion', category: 'space', name: '宇宙膨張 バッジ', emoji: '🎈', color: '#b5e2fa', desc: 'ビッグバンからはじまり、今でも風船のように膨らみつづける宇宙のうごき！', detailDesc: 'アインシュタインの相対論とハッブルの観測により判明した宇宙の拡大現象。遠くの銀河ほど光速に近い速度で遠ざかっています。' },

  // 🎓 6. けんていエリア (2個)
  { id: 'b_test_4', category: 'test', name: '4きゅう 合格バッジ', emoji: '🎓', color: '#ffd166', desc: 'てんもん宇宙けんてい 4きゅう（星空はかせ）に ごうかくした しょうめいバッジ！', detailDesc: '天文宇宙検定4級合格の証。太陽系の惑星や月、夜空の有名な星座に関する基礎知識をマスターした星空博士です！' },
  { id: 'b_test_3', category: 'test', name: '3きゅう 合格バッジ', emoji: '🏆', color: '#66fcf1', desc: 'てんもん宇宙けんてい 3きゅう（星空じゅんあんないにん）に ごうかくした しょうめいバッジ！', detailDesc: '天文宇宙検定3級合格の証。天文学の歴史、銀河や宇宙の構造、探査機の最新知見を深めた本格的な星空案内人です！' }
];

export const CATEGORIES = [
  { id: 'all', name: 'ぜんぶ' },
  { id: 'planets', name: '🪐 わくせい' },
  { id: 'vehicles', name: '🚀 のりもの' },
  { id: 'satellites', name: '🛰️ たんさき・えいせい' },
  { id: 'astronomers', name: '🔭 てんもんがくしゃ' },
  { id: 'space', name: '🌟 せいざ・うちゅう' },
  { id: 'test', name: '🎓 けんてい' }
];

// 難易度とモードの日本語マッピング
export const DIFFICULTY_MAP = {
  'easy': 'やさしい',
  'medium': 'ふつう',
  'hard': 'むずかしい',
  '4': '4きゅう',
  '3': '3きゅう'
};

export const MODE_MAP = {
  'ai': 'AIのひみつクイズ',
  'parent': 'おうちの人のクイズ',
  'test': 'てんもん宇宙けんてい',
  'spot_diff': '宇宙まちがいさがし'
};

// けんてい用組み立てプロジェクトデータ (4きゅう・3きゅう各4種、計8種)
export const TEST_PROJECTS = {
  'b_test_4': [
    {
      id: 'p_mmx',
      name: 'MMXローバー',
      parts: [
        { name: 'タイヤ', emoji: '🚜', desc: 'MMXローバーの タイヤ。でこぼこみちも へっちゃら！' },
        { name: 'ボディ', emoji: '📦', desc: 'MMXローバーの ボディ。中にひみつのロボ頭脳が入っているぞ！' },
        { name: 'ソーラーパネル', emoji: '🛰️', desc: 'MMXローバーの ソーラーパネル。たいようの光でパワーをためるぞ！' },
        { name: 'ロボットアーム', emoji: '🦾', desc: 'MMXローバーの ロボットアーム。いしやスナをつかめるぞ！' },
        { name: '完成ロボット', emoji: '🤖✨', desc: 'すべてのパーツがあつまって、かっこいい「MMXローバー」がかんせいしたぞ！' }
      ]
    },
    {
      id: 'p_artemis',
      name: 'アルテミスロケット',
      parts: [
        { name: 'ブースター', emoji: '🔥', desc: 'ロケットの よこにつく ほじょブースター。ものすごいちからで おしあげるぞ！' },
        { name: 'メインタンク', emoji: '🛢️', desc: 'おおきな 燃料タンク。ロケットが とぶための 燃料が入っているよ！' },
        { name: 'エンジン', emoji: '🚀', desc: 'メインエンジン。宇宙までいっきに飛ぶための超強力エンジン！' },
        { name: 'カプセル', emoji: '🛸', desc: '宇宙船カプセル。宇宙飛行士さんが乗る、最先端のコントロールルーム！' },
        { name: '完成ロケット', emoji: '🚀✨', desc: 'すべてのパーツがあつまって、超強力な「アルテミスロケット」がかんせいしたぞ！' }
      ]
    },
    {
      id: 'p_iss',
      name: 'うちゅうステーション (ISS)',
      parts: [
        { name: 'きぼうアーム', emoji: '🦾', desc: '宇宙ステーションのロボットアーム。いろんな実験につかうよ！' },
        { name: 'ドッキングハッチ', emoji: '🚪', desc: '宇宙船がくっつく入り口。ここから人が行き来するよ！' },
        { name: 'きぼう実験棟', emoji: '🧪', desc: '日本の実験スペース。宇宙の特別な環境で科学の実験をするよ！' },
        { name: 'ソーラーパネル', emoji: '☀️', desc: '大きなつばさのような太陽電池パネル。宇宙でたくさんの電気をつくるよ！' },
        { name: '完成ステーション', emoji: '🛰️✨', desc: 'すべてのパーツがあつまって、地球をまわる「うちゅうステーション」がかんせいしたぞ！' }
      ]
    },
    {
      id: 'p_lunar_rover',
      name: 'つきのくるま',
      parts: [
        { name: 'メッシュタイヤ', emoji: '🛞', desc: '月のスナでもすべらない、あみあみでできた特別なメッシュのタイヤ！' },
        { name: 'つうしんアンテナ', emoji: '📡', desc: '地球にデータを送るための、大きなお皿型のパラボラアンテナ！' },
        { name: 'カメラの目', emoji: '📷', desc: '月のまわりを撮影するための、とても頑丈なカメラの目！' },
        { name: 'うんてんせき', emoji: '💺', desc: '宇宙飛行士さんがすわる、宇宙服を着たまま乗れるシート！' },
        { name: '完成ローバー', emoji: '🏎️✨', desc: 'すべてのパーツがあつまって、月の砂漠をはしる「つきのくるま」がかんせいしたぞ！' }
      ]
    }
  ],
  'b_test_3': [
    {
      id: 'p_hayabusa2',
      name: 'はやぶさ２',
      parts: [
        { name: 'イオンエンジン', emoji: '🚀', desc: 'はやぶさ２のエンジン。青い光を出して、宇宙を長く長く飛ぶことができるよ！' },
        { name: 'サンプラーホーン', emoji: '🎺', desc: 'はやぶさ２のお鼻。小惑星の砂や石をストローのように吸い込むよ！' },
        { name: '回収カプセル', emoji: '☄️', desc: 'はやぶさ２のたからばこ。集めた砂を地球へ安全に届けるためのカプセル！' },
        { name: 'ターゲットマーカー', emoji: '🟢', desc: 'きらきら光るお手玉。小惑星に落として、着陸するときの目印にするよ！' },
        { name: '完成探査機', emoji: '🛰️✨', desc: 'すべてのパーツがあつまって、小惑星リュウグウを調査した「はやぶさ２」がかんせいしたぞ！' }
      ]
    },
    {
      id: 'p_voyager',
      name: 'ボイジャー',
      parts: [
        { name: 'パラボラアンテナ', emoji: '📡', desc: '大きなおわん型アンテナ。何十億キロもはなれた地球へ電波を送るよ！' },
        { name: '原子力電池', emoji: '🔋', desc: '太陽の光がとどかない遠くの宇宙でも、あつあつで電気をつくりつづける電池！' },
        { name: 'ゴールデンレコード', emoji: '📀', desc: '地球の音や写真、あいさつをのせた金色のレコード。宇宙人へのメッセージ！' },
        { name: 'カメラアーム', emoji: '🤳', desc: '木星や土星のきれいな写真をたくさん撮影した、ボイジャーのカメラのうで！' },
        { name: '完成探査機', emoji: '🛸✨', desc: 'すべてのパーツがあつまって、太陽系の外へと旅をつづける伝説の「ボイジャー」がかんせいしたぞ！' }
      ]
    },
    {
      id: 'p_hubble',
      name: 'ハッブルぼうえんきょう',
      parts: [
        { name: 'おおきな鏡', emoji: '🪞', desc: 'ハッブルの目となる大きな反射鏡。遠くの星のわずかな光を集めるよ！' },
        { name: 'フタのドア', emoji: '🚪', desc: '望遠鏡のいりぐち。明るすぎる光が入ってこないようにフタをするドア！' },
        { name: 'ソーラーのつばさ', emoji: '☀️', desc: '宇宙で動くための電気をつくる、ハッブルの左右にのびたソーラーパネル！' },
        { name: '宇宙のカメラ', emoji: '📷', desc: '星が生まれるガス雲など、宇宙のうつくしい姿をカラーでとらえる高性能カメラ！' },
        { name: '完成望遠鏡', emoji: '🔭✨', desc: 'すべてのパーツがあつまって、宇宙の歴史を書き換えた「ハッブル宇宙望遠鏡」がかんせいしたぞ！' }
      ]
    },
    {
      id: 'p_jwst',
      name: 'ウェッブぼうえんきょう',
      parts: [
        { name: 'きんいろの鏡', emoji: '🪙', desc: 'ハニカム型の金メッキ反射鏡。宇宙のいちばん最初期の星の光をとらえる鏡！' },
        { name: '日よけのシート', emoji: '🛡️', desc: 'テニスコートサイズの遮熱シールド。太陽の熱からデリケートな鏡を守るよ！' },
        { name: '鏡の支柱', emoji: '🗼', desc: '集めた光をカメラへ反射させるための、副鏡をささえる頑丈な３本の支柱！' },
        { name: '赤外線カメラ', emoji: '🎛️', desc: '宇宙のチリを通り抜けて、はるか遠くの星を見透かすことができる赤外線カメラ！' },
        { name: '完成望遠鏡', emoji: '👁️✨', desc: 'すべてのパーツがあつまって、最新鋭の「ジェイムズ・ウェッブ宇宙望遠鏡」がかんせいしたぞ！' }
      ]
    }
  ]
};

export const PROJECT_IMAGE_MAP = {
  'p_mmx': 'p_mmx.png',
  'p_artemis': 'p_artemis.png',
  'p_iss': 'p_iss.png',
  'p_lunar_rover': 'p_lunar_rover.png',
  'p_hayabusa2': 'p_hayabusa2.png',
  'p_voyager': 'p_voyager.png',
  'p_hubble': 'p_hubble.png',
  'p_jwst': 'p_jwst.png'
};
