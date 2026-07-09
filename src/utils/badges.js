// 128個のバッジデータプール（カテゴリ別に合計128個）
export const BADGE_POOL = [
  // 🪐 1. わくせいエリア (26個)
  { id: 'b_sun', category: 'planets', name: 'たいよう バッジ', emoji: '☀️', color: '#fb8500', desc: 'ちきゅうに ひかりと あたたかさを くれる、もえる おおきな ほし！' },
  { id: 'b_mercury', category: 'planets', name: 'すいせい バッジ', emoji: '🪐', color: '#8a8a8a', desc: 'たいように いちばん ちかい、あつくて いしの おおい ほし！' },
  { id: 'b_venus', category: 'planets', name: 'きんせい バッジ', emoji: '✨', color: '#ffb703', desc: 'あつい くもに おおわれた、ピカピカ ひかる まぶしい ほし！' },
  { id: 'b_earth', category: 'planets', name: 'ちきゅう バッジ', emoji: '🌏', color: '#4cc9f0', desc: 'ぼくたちが すんでいる、おみずと みどりの うつくしい ほし！' },
  { id: 'b_moon', category: 'planets', name: 'つき バッジ', emoji: '🌙', color: '#ffd166', desc: 'よるに ちきゅうを やさしく てらす、いちばん ちかい おともだちの ほし！' },
  { id: 'b_mars', category: 'planets', name: 'かせい バッジ', emoji: '🔴', color: '#ef476f', desc: 'あかい いしや スナに おおわれた、ちきゅうの すぐ おとなりの ほし！' },
  { id: 'b_jupiter', category: 'planets', name: 'もくせい バッジ', emoji: '🪵', color: '#c5a059', desc: 'たいようけいで いちばん おおきい、ガスでできた ぐるぐるもようの ほし！' },
  { id: 'b_saturn', category: 'planets', name: 'どせい バッジ', emoji: '🪐', color: '#ffd166', desc: 'こおりや いしでできた、きれいな わ（リング）を もつ ほし！' },
  { id: 'b_uranus', category: 'planets', name: 'てんのうせい バッジ', emoji: '🌀', color: '#4cc9f0', desc: 'ひえひえの つめたい ほしで、よこだおしになって まわっているよ！' },
  { id: 'b_neptune', category: 'planets', name: 'かいおうせい バッジ', emoji: '🔵', color: '#118ab2', desc: 'たいようから いちばん とおい、あおい あらしの ふく ほし！' },
  { id: 'b_pluto', category: 'planets', name: 'めいおうせい バッジ', emoji: '❄️', color: '#b5e2fa', desc: 'ちいさくて つめたい ほし。じめんに ハートの もようがあるよ！' },
  { id: 'b_ceres', category: 'planets', name: 'ケレス バッジ', emoji: '🪨', color: '#6c757d', desc: 'かせいと もくせいの あいだにある、いちばん おおきな じゅんわくせい！' },
  { id: 'b_eris', category: 'planets', name: 'エリス バッジ', emoji: '🧊', color: '#a2d2ff', desc: 'めいおうせいより とおい ばしょにある、こおりの じゅんわくせい！' },
  { id: 'b_haumea', category: 'planets', name: 'ハウメア バッジ', emoji: '🥚', color: '#e9ecef', desc: 'ラグビーボールのような タマゴのかたちをした、おもしろい ほし！' },
  { id: 'b_makemake', category: 'planets', name: 'マケマケ バッジ', emoji: '🟤', color: '#b5838d', desc: 'めいおうせいの すぐちかくを まわる、あかい こおりの ほし！' },
  { id: 'b_halley', category: 'planets', name: 'ハレーほうきぼし', emoji: '☄️', color: '#a2d2ff', desc: '76ねんに いちどだけ ちきゅうに ちかづく、しっぽのある ほうきぼし！' },
  { id: 'b_great_red_spot', category: 'planets', name: '大せきはん バッジ', emoji: '🌀', color: '#e63946', desc: 'もくせいにある、ちきゅうが すっぽり入る くらい おおきな 赤いあらし！' },
  { id: 'b_cassini_division', category: 'planets', name: 'カッシーニのすきま', emoji: '🍩', color: '#4a4e69', desc: 'どせいの わ（リング）にある、すきまの なまえだよ！' },
  { id: 'b_earth_ocean', category: 'planets', name: 'あおいうみ バッジ', emoji: '🌊', color: '#0077b6', desc: 'ちきゅうの ひょうめんの ほとんどをおおう、ひろい おみずの エリア！' },
  { id: 'b_mars_sand', category: 'planets', name: 'あかいスナ バッジ', emoji: '🏜️', color: '#e59866', desc: 'かせいの じめんをおおう、てつの さびが まざった あかいスナ！' },
  { id: 'b_lunar_crater', category: 'planets', name: 'つきのあな バッジ', emoji: '🕳️', color: '#bdc3c7', desc: 'いし（いんせき）が ぶつかってできた、つきの じめんの デコボコ！' },
  { id: 'b_solar_flare', category: 'planets', name: 'フレア バッジ', emoji: '💥', color: '#ff4d6d', desc: 'たいようの ひょうめんで おこる、ものすごい 大ばくはつ！' },
  { id: 'b_jupiter_stripe', category: 'planets', name: 'もくせい しましま', emoji: '🦓', color: '#d5a6bd', desc: 'もくせいの はやい かぜが つくりだす、きれいな しまもよう！' },
  { id: 'b_saturn_ring', category: 'planets', name: 'どせいのわ バッジ', emoji: '⭕', color: '#f9d71c', desc: 'どせいの まわりを 高そくで まわる、こおりの つぶの あつまり！' },
  { id: 'b_uranus_tilt', category: 'planets', name: 'よこだおし バッジ', emoji: '🛌', color: '#70d6ff', desc: 'てんのうせいが コロコロ ころがるように まわっている ふしぎなすがた！' },
  { id: 'b_blue_storm', category: 'planets', name: 'あおいあらし バッジ', emoji: '🌪️', color: '#03045e', desc: 'かいおうせいにある、ちきゅうと おなじ大きさの つよい風のあらし！' },

  // 🚀 2. のりものエリア (25個)
  { id: 'b_rocket', category: 'vehicles', name: 'ロケット バッジ', emoji: '🚀', color: '#ffb703', desc: 'うちゅうへ とびだす、かっこいい のりもの！' },
  { id: 'b_ufo', category: 'vehicles', name: 'UFO バッジ', emoji: '🛸', color: '#66fcf1', desc: 'うちゅうじんが のっているかも しれない、なぞの ひこうき！' },
  { id: 'b_space_shuttle', category: 'vehicles', name: 'シャトル バッジ', emoji: '🛩️', color: '#e9ecef', desc: 'なんども うちゅうと ちきゅうを おうふくした、うちゅうひこうき！' },
  { id: 'b_iss', category: 'vehicles', name: 'ISS バッジ', emoji: '🛰️', color: '#b5e2fa', desc: 'ちきゅうの まわりを まわる、うちゅうひこうしさんが くらす しせつ！' },
  { id: 'b_lunar_rover', category: 'vehicles', name: 'つきのくるま バッジ', emoji: '🏎️', color: '#8a8a8a', desc: 'つきの じめんを はしるために つくられた、とくべつな くるま！' },
  { id: 'b_sputnik', category: 'vehicles', name: 'スプートニク', emoji: '📡', color: '#ced4da', desc: 'にんげんが はじめて うちゅうに おくった、ちいさな 人こうえいせい！' },
  { id: 'b_voyager', category: 'vehicles', name: 'ボイジャー バッジ', emoji: '🛸', color: '#ffd166', desc: 'たいようけいの はてまで たびをつづける、でんせつの たんさき！' },
  { id: 'b_hayabusa', category: 'vehicles', name: 'はやぶさ バッジ', emoji: '🦅', color: '#4cc9f0', desc: 'いとかわ という 小わくせいから、いしを もちかえった 日本のたんさき！' },
  { id: 'b_hayabusa2', category: 'vehicles', name: 'はやぶさ2 バッジ', emoji: '🛰️', color: '#52b788', desc: 'りゅうぐう という 小わくせいから、スナを もちかえった たんさき！' },
  { id: 'b_hubble', category: 'vehicles', name: 'ハッブル バッジ', emoji: '🔭', color: '#a2d2ff', desc: 'うちゅうを とびながら とおくの ほしを かんさつする ぼうえんきょう！' },
  { id: 'b_jwst', category: 'vehicles', name: 'ウェッブ バッジ', emoji: '👁️', color: '#ffb703', desc: 'きんいろの かがみを もつ、さいしんえいの うちゅうぼうえんきょう！' },
  { id: 'b_artemis', category: 'vehicles', name: 'アルテミス バッジ', emoji: '🏹', color: '#ef476f', desc: 'ふたたび 月に にんげんを おくるための、おおかた ロケット！' },
  { id: 'b_starship', category: 'vehicles', name: 'スターシップ', emoji: '🚀', color: '#e9ecef', desc: 'たくさんの 人を 火せいにおくるために つくられている 巨大ロケット！' },
  { id: 'b_sls', category: 'vehicles', name: 'SLS バッジ', emoji: '🔥', color: '#fb8500', desc: 'アルテミスけいかくで つかわれる、ものすごい パワーの ロケット！' },
  { id: 'b_apollo11', category: 'vehicles', name: 'アポロ11ごう', emoji: '🌕', color: '#ffd166', desc: 'はじめて にんげんを 月へ つれていった、でんせつの うちゅうせん！' },
  { id: 'b_kibou', category: 'vehicles', name: 'きぼう バッジ', emoji: '🎌', color: '#ef476f', desc: 'ISS（宇宙ステーション）にある、日本の じっけんスペース！' },
  { id: 'b_curiosity', category: 'vehicles', name: 'キュリオシティ', emoji: '🤖', color: '#8a8a8a', desc: 'かせいの じめんを 走りながら、水や 生きもののあとを さがすロボ！' },
  { id: 'b_perseverance', category: 'vehicles', name: 'パーシビアランス', emoji: '📸', color: '#ffb703', desc: 'かせいで 音をろくおんしたり、ヘリコプターを とばした 最新ロボ！' },
  { id: 'b_ingenuity', category: 'vehicles', name: 'インジェニュイティ', emoji: '🛸', color: '#52b788', desc: 'ちきゅう 以外の ほし（かせい）で、はじめて とんだ ヘリコプター！' },
  { id: 'b_pioneer10', category: 'vehicles', name: 'パイオニア バッジ', emoji: '🛰️', color: '#a2d2ff', desc: 'うちゅうじんへの メッセージばんを のせて とぶ、ふるいたんさき！' },
  { id: 'b_cassini', category: 'vehicles', name: 'カッシーニ バッジ', emoji: '🪐', color: '#c5a059', desc: 'どせいの わ（リング）や 衛星を たくさんかんさつした たんさき！' },
  { id: 'b_new_horizons', category: 'vehicles', name: 'ニューホライズンズ', emoji: '🌌', color: '#4cc9f0', desc: 'めいおうせいの ちかくを とおりすぎ、ハートもようを 見つけた探さき！' },
  { id: 'b_space_suit', category: 'vehicles', name: 'うちゅうふく', emoji: '🧑‍🚀', color: '#e9ecef', desc: 'さむくて 空気のない うちゅうで、からだをまもる とくべつなふく！' },
  { id: 'b_capsule', category: 'vehicles', name: 'カプセル バッジ', emoji: '☄️', color: '#4cc9f0', desc: '小わくせいのスナを入れて、ちきゅうに とどけた たからばこ！' },
  { id: 'b_pencil_rocket', category: 'vehicles', name: 'ペンシルロケット', emoji: '✏️', color: '#8a8a8a', desc: '日本の うちゅう開発のはじまりとなった、えんぴつサイズのロケット！' },

  // 🛰️ 3. たんさき・えいせいエリア (26個)
  { id: 'b_phobos', category: 'satellites', name: 'フォボス バッジ', emoji: '🥔', color: '#b5838d', desc: 'かせいの まわりをまわる、ジャガイモのような かたちの 小さな衛星！' },
  { id: 'b_deimos', category: 'satellites', name: 'ダイモス バッジ', emoji: '🪨', color: '#a0a5c0', desc: 'フォボスと いっしょに かせいを まわる、でこぼこの ちいさな衛星！' },
  { id: 'b_io', category: 'satellites', name: 'イオ バッジ', emoji: '🌋', color: '#fb8500', desc: 'もくせいの まわりを まわる、かざんが いっぱいある カラフルな衛星！' },
  { id: 'b_europa', category: 'satellites', name: 'エウロパ バッジ', emoji: '🧊', color: '#b5e2fa', desc: 'ひょうめんが こおりでおおわれ、なかに 海があるかも しれない衛星！' },
  { id: 'b_ganymede', category: 'satellites', name: 'ガニメデ バッジ', emoji: '🌌', color: '#8a8a8a', desc: 'たいようけいの 衛星のなかで、いちばん おおきな衛星（水星より大きい）！' },
  { id: 'b_callisto', category: 'satellites', name: 'カリスト バッジ', emoji: '☄️', color: '#4a4e69', desc: 'クレーター（いんせきのあと）が いちばん たくさんある もくせいの衛星！' },
  { id: 'b_titan', category: 'satellites', name: 'タイタン バッジ', emoji: '🌫️', color: '#ffb703', desc: 'あつい空気におおわれ、オレンジ色のガスにつつまれて、川がある衛星！' },
  { id: 'b_enceladus', category: 'satellites', name: 'エンケラドゥス', emoji: '⛲', color: '#a2d2ff', desc: 'こおりの すきまから、おみずの温泉（おんせん）を ふきだしている衛星！' },
  { id: 'b_mimas', category: 'satellites', name: 'ミマス バッジ', emoji: '👁️', color: '#ced4da', desc: 'スター・ウォーズのでっかい宇宙船（デス・スター）にそっくりな衛星！' },
  { id: 'b_charon', category: 'satellites', name: 'カロン バッジ', emoji: '🌑', color: '#4a4e69', desc: 'めいおうせいと ほぼおなじ大きさで、お互いに見つめ合ってまわる衛星！' },
  { id: 'b_philae', category: 'satellites', name: 'フィラエ バッジ', emoji: '🦗', color: '#52b788', desc: 'ほうきぼしの ひょうめんに、はじめて 着りくした 小さなたんさ機！' },
  { id: 'b_rosetta', category: 'satellites', name: 'ロゼッタ バッジ', emoji: '🛰️', color: '#a2d2ff', desc: 'ほうきぼしに ピッタリよりそって、ずっと かんさつをつづけた探さき！' },
  { id: 'b_triton', category: 'satellites', name: 'トリトン バッジ', emoji: '❄️', color: '#70d6ff', desc: 'ほかの衛星とは はんたいのむきに まわっている、つめたい衛星！' },
  { id: 'b_titania', category: 'satellites', name: 'チタニア バッジ', emoji: '💎', color: '#e9ecef', desc: 'てんのうせいの まわりをまわる、いちばん おおきな こおりの衛星！' },
  { id: 'b_oberon', category: 'satellites', name: 'オベロン バッジ', emoji: '⛰️', color: '#8a8a8a', desc: 'てんのうせいの衛星で、山や クレーターがいっぱいある ごつごつしたほし！' },
  { id: 'b_phobos_crater', category: 'satellites', name: 'スティックニー', emoji: '🎯', color: '#b5838d', desc: 'フォボスの ひょうめんにある、フォボスそのものと同じくらい巨大なクレーター！' },
  { id: 'b_akatsuki', category: 'satellites', name: 'あかつき バッジ', emoji: '🎌', color: '#ffb703', desc: 'きんせいの まわりをまわり、あつい雲のうごきをしらべる 日本の探さき！' },
  { id: 'b_kaguya', category: 'satellites', name: 'かぐや バッジ', emoji: '🎌', color: '#ffd166', desc: 'つきの ひょうめんを ハイビジョンカメラできれいにさつえいした探さき！' },
  { id: 'b_parker', category: 'satellites', name: 'パーカー バッジ', emoji: '🔥', color: '#fb8500', desc: 'たいように いちばん ちかくまで行って、あつい風を調べる熱いつよい探さき！' },
  { id: 'b_juno', category: 'satellites', name: 'ジュノー バッジ', emoji: '🪐', color: '#8a8a8a', desc: 'もくせいの ガスにつつまれた中を調べるために、すぐそばをまわる探さき！' },
  { id: 'b_mir', category: 'satellites', name: 'ミール バッジ', emoji: '🚀', color: '#b5e2fa', desc: 'ロシアがつくり、むかし うちゅうひこうしさんが 長くくらした宇宙ステーション！' },
  { id: 'b_skylab', category: 'satellites', name: 'スカイラブ', emoji: '🏗️', color: '#ced4da', desc: 'アメリカが はじめて つくった、しょだいの 宇宙ステーション！' },
  { id: 'b_luna3', category: 'satellites', name: 'ルナ3ごう', emoji: '📸', color: '#8a8a8a', desc: 'ちきゅうからは 絶対に見えない「月のうらがわ」を はじめてさつえいした探さき！' },
  { id: 'b_pioneer_venus', category: 'satellites', name: 'パイオニア金星', emoji: '✨', color: '#ffb703', desc: 'きんせいの あつい雲の下に レーダーをとおして 地形を調べた探さき！' },
  { id: 'b_luna16', category: 'satellites', name: 'ルナ16ごう', emoji: '🚜', color: '#8a8a8a', desc: 'にんげんが乗らない ロボットだけで、つきのいしを持ってかえってきた探さき！' },
  { id: 'b_mio', category: 'satellites', name: 'みお バッジ', emoji: '🎌', color: '#66fcf1', desc: 'すいせいを調べるために、日本のロケットでとびたった 日欧きょうどうの探さき！' },

  // 🔭 4. てんもんがくしゃエリア (25個)
  { id: 'b_galileo', category: 'astronomers', name: 'ガリレオ バッジ', emoji: '🔭', color: '#c5a059', desc: 'はじめて ぼうえんきょうを 夜空にむけて、もくせいの衛星や月のデコボコを見つけた人！' },
  { id: 'b_copernicus', category: 'astronomers', name: 'コペルニクス', emoji: '🧭', color: '#ffd166', desc: 'ちきゅうではなく、「たいようが まんなかに ある」とはじめて言った人！' },
  { id: 'b_kepler', category: 'astronomers', name: 'ケプラー バッジ', emoji: '🌀', color: '#4cc9f0', desc: 'わくせいが 円（まる）ではなく、すこし つぶれただ円の形でまわる法則を見つけた人！' },
  { id: 'b_newton', category: 'astronomers', name: 'ニュートン', emoji: '🍎', color: '#ef476f', desc: 'リンゴが落ちるのをみて、ひっぱる力「じゅうりょく（重力）」を見つけた人！' },
  { id: 'b_einstein', category: 'astronomers', name: 'アインシュタイン', emoji: '👅', color: '#b5e2fa', desc: 'じゅうりょくは 宇宙の「ゆがみ」である、という 相対性理論をかんがえた天才学者！' },
  { id: 'b_edwin_hubble', category: 'astronomers', name: 'ハッブルはかせ', emoji: '🌌', color: '#a2d2ff', desc: '宇宙には 天の川のほかにも 銀河がたくさんあり、宇宙がどんどん膨らんでいるのを見つけた人！' },
  { id: 'b_sagan', category: 'astronomers', name: 'セーガンはかせ', emoji: '📺', color: '#52b788', desc: 'テレビや本で、宇宙のロマンや「宇宙人さがし」を楽しくみんなに伝えた学者さん！' },
  { id: 'b_hawking', category: 'astronomers', name: 'ホーキング博士', emoji: '♿', color: '#8a8a8a', desc: 'ブラックホールが すこしずつ 蒸発（じょうはつ）して消えていくことを発表した学者さん！' },
  { id: 'b_herschel', category: 'astronomers', name: 'ハーシェル バッジ', emoji: '🪐', color: '#70d6ff', desc: 'じぶんの手づくりの ぼうえんきょうで、「てんのうせい」を発見したイギリスの人！' },
  { id: 'b_tombaugh', category: 'astronomers', name: 'トンボー バッジ', emoji: '❄️', color: '#b5e2fa', desc: '写真を見くらべる ねばりづよい ほうほうで、「めいおうせい」を発見した人！' },
  { id: 'b_ptolemy', category: 'astronomers', name: 'プトレマイオス', emoji: '📜', color: '#c5a059', desc: 'むかしのローマで、地球のまわりを星がまわる「天動説」をまとめた古代の学者！' },
  { id: 'b_bruno', category: 'astronomers', name: 'ブルーノ バッジ', emoji: '🕯️', color: '#ff4d6d', desc: '「宇宙にはちきゅうと同じような星が無数にあり、宇宙人はいる」と言い張って処刑された人！' },
  { id: 'b_brahe', category: 'astronomers', name: 'ティコ・ブラーエ', emoji: '📐', color: '#ffd166', desc: 'ぼうえんきょうができる前に、ものすごい正確さで星のうごきを目で記録しつづけた人！' },
  { id: 'b_halley_person', category: 'astronomers', name: 'ハレーはかせ', emoji: '☄️', color: '#a2d2ff', desc: 'ほうきぼしの軌道を計算し、76年ごとに もどってくることを予言してあてた人！' },
  { id: 'b_leavitt', category: 'astronomers', name: 'レビット バッジ', emoji: '🕯️', color: '#ffb703', desc: '星がチカチカ明暗する周期から、その星までのきょりを測る方法を見つけた女性学者！' },
  { id: 'b_messier', category: 'astronomers', name: 'メシエ バッジ', emoji: '🌌', color: '#4cc9f0', desc: 'メシエカタログ（M1〜M110）をつくったフランスの彗星ハンター！' },
  { id: 'b_piazzi', category: 'astronomers', name: 'ピアッツィ', emoji: '🪨', color: '#6c757d', desc: '1801年の元旦に、はじめての小わくせい「ケレス」を発見したシチリアの神父さま！' },
  { id: 'b_galle', category: 'astronomers', name: 'ガレ バッジ', emoji: '🔵', color: '#118ab2', desc: 'ルヴェリエの計算した予測位置をもとに、「かいおうせい」を初めて観測で発見した人！' },
  { id: 'b_le_verrier', category: 'astronomers', name: 'ルヴェリエ', emoji: '✏️', color: '#e9ecef', desc: '計算だけで海王星の位置をあてた、数学が得意なフランス of 天文学者！' },
  { id: 'b_lowell', category: 'astronomers', name: 'ローウェル', emoji: '🏜️', color: '#e59866', desc: '火星には運河があり火星人がいると信じ、冥王星の捜索も始めたアメリカの天文学者！' },
  { id: 'b_asaph_hall', category: 'astronomers', name: 'アサフ・ホール', emoji: '🥔', color: '#b5838d', desc: '火星のちいさな２つの衛星「フォボス」と「ダイモス」を発見した天文学者！' },
  { id: 'b_payne', category: 'astronomers', name: 'ペイン博士', emoji: '☀️', color: '#fb8500', desc: 'たいようや星が「水素とヘリウム」のガスでできていることをつきとめた女性学者！' },
  { id: 'b_bell_burnell', category: 'astronomers', name: 'ベル＝バーネル', emoji: '📻', color: '#66fcf1', desc: '規則正しい電波パルスをだす、中性子星（パルサー）を初めて見つけた女性！' },
  { id: 'b_penrose', category: 'astronomers', name: 'ペンローズ', emoji: '📐', color: '#8a8a8a', desc: 'ブラックホールの中心に、密度が無限大になる「特異点」があることを数式で証明した人！' },
  { id: 'b_nobel', category: 'astronomers', name: 'ノーベル賞バッジ', emoji: '🏅', color: '#ffd166', desc: 'ブラックホールや宇宙の加速膨張の発見など、宇宙の謎をといた人に送られる賞！' },

  // 🌟 5. せいざ・うちゅうエリア (26個)
  { id: 'b_const_orion', category: 'space', name: 'オリオン座 バッジ', emoji: '🏹', color: '#4cc9f0', desc: 'ふゆの夜空にかがやく、３つのならんだ星（三ツ星）がめじるしの狩人の星座！' },
  { id: 'b_const_dipper', category: 'space', name: '北斗七星 バッジ', emoji: '🥄', color: '#ffd166', desc: 'おおぐま座のしっぽにある、ひしゃくの形をした有名な７つの星のあつまり！' },
  { id: 'b_const_cassiopeia', category: 'space', name: 'カシオペヤ座', emoji: '👑', color: '#b5e2fa', desc: 'アルファベットの「W」の形をした、秋の夜空の王妃さまの星座！' },
  { id: 'b_const_cygnus', category: 'space', name: 'はくちょう座', emoji: '🦢', color: '#e9ecef', desc: '夏の天の川のうえで、大きな十字架をえがいて飛ぶ白鳥の星座！' },
  { id: 'b_const_scorpius', category: 'space', name: 'さそり座 バッジ', emoji: '🦂', color: '#ef476f', desc: '夏の南の空ひくくにかがやく、赤い心臓の星（アンタレス）をもつサソリの星座！' },
  { id: 'b_const_leo', category: 'space', name: 'しし座 バッジ', emoji: '🦁', color: '#fb8500', desc: 'はるの夜空をかける、ライオンの星座。クエスチョンマークの逆のような形がめじるし！' },
  { id: 'b_andromeda', category: 'space', name: 'アンドロメダ銀河', emoji: '🌀', color: '#a2d2ff', desc: 'ちきゅうから いちばん近い、２５０万光年かなたにある おおきなうずまき銀河！' },
  { id: 'b_milky_way', category: 'space', name: '天の川銀河 バッジ', emoji: '🌌', color: '#b5e2fa', desc: 'ぼくたちの 太陽系がある、数千億個もの星がうずをまく巨大な銀河！' },
  { id: 'b_black_hole', category: 'space', name: 'ブラックホール', emoji: '🕳️', color: '#000000', desc: 'ものすごい重力で、光さえも吸い込んで出られなくしてしまう暗黒の天体！' },
  { id: 'b_supernova', category: 'space', name: '超新星ばくはつ', emoji: '💥', color: '#ff4d6d', desc: '重い星が一生の終わりに起こす、銀河全体よりまぶしくかがやく大ばくはつ！' },
  { id: 'b_nebula_orion', category: 'space', name: 'オリオン大星雲', emoji: '☁️', color: '#d5a6bd', desc: 'オリオン座 of 刀の場所にある、宇宙のガスがひかって新しい星がうまれる工場！' },
  { id: 'b_pleiades', category: 'space', name: 'すばる バッジ', emoji: '💎', color: '#70d6ff', desc: 'あおいガスにつつまれた、若い星たちがギュッとあつまる美しい星団！' },
  { id: 'b_crab_nebula', category: 'space', name: 'かに星雲 バッジ', emoji: '🦀', color: '#ffb703', desc: '超新星爆発のガスが広がった天体。真ん中でパルサーが超高速で回転しているよ！' },
  { id: 'b_aurora', category: 'space', name: 'オーロラ バッジ', emoji: '💚', color: '#52b788', desc: '太陽の電気が地球の空気にぶつかって、夜空にひらめく美しい光のカーテン！' },
  { id: 'b_shooting_star', category: 'space', name: 'ながれ星 バッジ', emoji: '💫', color: '#ffd166', desc: '宇宙の小さなチリが地球の空気にぶつかり、一瞬で燃えつきながら光るもの！' },
  { id: 'b_const_aries', category: 'space', name: 'おひつじ座 バッジ', emoji: '🐏', color: '#ffd166', desc: '黄道十二星座の１つ。むかしのギリシャで、黄金の毛皮をもつ空飛ぶヒツジの星座！' },
  { id: 'b_const_taurus', category: 'space', name: 'おうし座 バッジ', emoji: '🐂', color: '#c5a059', desc: '赤い巨大な目の星（アルデバラン）とすばるを背中にのせたオウシの星座！' },
  { id: 'b_const_gemini', category: 'space', name: 'ふたご座 バッジ', emoji: '👬', color: '#e9ecef', desc: 'カストルとポルックスという、仲良しのふたごの兄弟の星座！' },
  { id: 'b_const_cancer', category: 'space', name: 'かに座 バッジ', emoji: '🦀', color: '#ef476f', desc: '勇者ヘラクレスとのたたかいのなかで、星座にあげてもらったカニの星座！' },
  { id: 'b_const_libra', category: 'space', name: 'てんびん座 バッジ', emoji: '⚖️', color: '#52b788', desc: '正義の女神アストライアがかつて使っていた、善悪をはかる天秤の星座！' },
  { id: 'b_const_sagittarius', category: 'space', name: 'いて座 バッジ', emoji: '🏹', color: '#a2d2ff', desc: '銀河系の中心の方向にある、半人半馬の賢者が弓をひく星座！' },
  { id: 'b_const_capricornus', category: 'space', name: 'やぎ座 バッジ', emoji: '🐐', color: '#8a8a8a', desc: '怪物から逃げるために、あわてて下半身を魚にした牧神パンの星座！' },
  { id: 'b_const_aquarius', category: 'space', name: 'みずがめ座 バッジ', emoji: '🏺', color: '#4cc9f0', desc: '美少年が、神々のために「お酒と水」を注ぐ水がめをもつ星座！' },
  { id: 'b_const_pisces', category: 'space', name: 'うお座 バッジ', emoji: '🐟', color: '#70d6ff', desc: 'リボンで結ばれた二匹の魚が、怪物から隠れて泳ぐ姿の星座！' },
  { id: 'b_dark_matter', category: 'space', name: '暗黒物質 バッジ', emoji: '🛸', color: '#4a4e69', desc: '目には見えないけれど、強い重力だけを放って宇宙を形作る謎の物質！' },
  { id: 'b_universe_expansion', category: 'space', name: '宇宙膨張 バッジ', emoji: '🎈', color: '#b5e2fa', desc: 'ビッグバンからはじまり、今でも風船のように膨らみつづける宇宙のうごき！' },
  { id: 'b_test_4', category: 'test', name: '4きゅう 合格バッジ', emoji: '🎓', color: '#ffd166', desc: 'てんもん宇宙けんてい 4きゅう（星空はかせ）に ごうかくした しょうめいバッジ！' },
  { id: 'b_test_3', category: 'test', name: '3きゅう 合格バッジ', emoji: '🏆', color: '#66fcf1', desc: 'てんもん宇宙けんてい 3きゅう（星空じゅんあんないにん）に ごうかくした しょうめいバッジ！' }
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
  'test': 'てんもん宇宙けんてい'
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
        { name: 'おおきな鏡', emoji: '🪞', desc: 'ハッブルの目となる大きな反射鏡。遠くの星 of わずかな光を集めるよ！' },
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

/**
 * 合格回数から、プロジェクトの進行状況と完成済みのプロジェクトリストを返す
 */
export function getProjectStatus(badgeId, count) {
  const projects = TEST_PROJECTS[badgeId];
  if (!projects) return null;

  if (count <= 0) {
    return {
      currentProjectIndex: 0,
      currentProject: projects[0],
      currentPartIndex: -1, // まだパーツを1つも持っていない
      isAllCompleted: false,
      completedList: []
    };
  }

  const maxProjectCount = projects.length; // 4
  // 1つのプロジェクトは5回の合格で完成。
  // 合格回数から、現在どのプロジェクトを組み立て中かを判定
  const currentProjectIndex = Math.min(maxProjectCount - 1, Math.floor((count - 1) / 5));

  let currentPartIndex = 0;
  if (count >= maxProjectCount * 5) {
    currentPartIndex = 4; // すべて完成している場合は、最後のプロジェクトの「完成体」
  } else {
    currentPartIndex = (count - 1) % 5;
  }

  const isAllCompleted = count >= maxProjectCount * 5;

  // 完成済みのプロジェクトリストを抽出
  const completedList = [];
  const completedCount = Math.min(maxProjectCount, Math.floor(count / 5));
  for (let i = 0; i < completedCount; i++) {
    const proj = projects[i];
    completedList.push({
      id: proj.id,
      name: proj.name,
      emoji: proj.parts[4].emoji,
      color: badgeId === 'b_test_3' ? '#4cc9f0' : '#ffd166', // 級に合わせた色
      desc: proj.parts[4].desc,
      projectIndex: i,
      image: '/images/' + PROJECT_IMAGE_MAP[proj.id]
    });
  }

  return {
    currentProjectIndex,
    currentProject: projects[currentProjectIndex],
    currentPartIndex, // 0 = パーツ1, 1 = パーツ2, 2 = パーツ3, 3 = パーツ4, 4 = 完成体
    isAllCompleted,
    completedList
  };
}

/**
 * 獲得回数に応じてバッジ情報（絵文字、名前、説明）を動的に差し替えて返す
 */
export function getDynamicBadgeInfo(badge, count = 1) {
  if (!badge) return null;

  if (badge.id === 'b_test_4' || badge.id === 'b_test_3') {
    const status = getProjectStatus(badge.id, count);
    if (status && status.currentProject) {
      const part = status.currentProject.parts[status.currentPartIndex];
      if (part) {
        return {
          ...badge,
          name: status.currentPartIndex === 4
            ? `${status.currentProject.name}（かんせい！）`
            : `${status.currentProject.name}の ${part.name}`,
          emoji: part.emoji,
          desc: part.desc,
          image: status.currentPartIndex === 4
            ? '/images/' + PROJECT_IMAGE_MAP[status.currentProject.id]
            : null
        };
      }
    }
  }

  return badge;
}

/**
 * 獲得された最高難易度に基づいて、バッジのフチ色（ボーダー色）を返す
 */
export function getBadgeBorderColor(earnedInfo) {
  if (!earnedInfo || !earnedInfo.earnedDetails || earnedInfo.earnedDetails.length === 0) {
    return 'rgba(255, 255, 255, 0.15)'; // 未獲得時のデフォルト
  }

  const difficulties = earnedInfo.earnedDetails.map(d => d.difficulty);

  if (difficulties.includes('hard')) {
    return '#ffb703'; // 金色 (むずかしい)
  }
  if (difficulties.includes('medium') || difficulties.includes('3')) {
    return '#3a86ff'; // 青 (ふつう / 3きゅう)
  }
  if (difficulties.includes('easy') || difficulties.includes('4')) {
    return '#ffffff'; // 白 (やさしい / 4きゅう)
  }

  return '#ffffff'; // デフォルト白
}

