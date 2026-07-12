// Web Audio API を使用した効果音・BGM管理クラス
// 外部音声ファイルがなくても、ブラウザの機能だけでシンセサイザーのように効果音を合成して鳴らします。

class AudioService {
  constructor() {
    this.ctx = null;
    this.enabled = true; // 音のON/OFF
    this.bgmAudio = null; // BGM用HTMLAudioElement (フォールバック)
    this.bgmTimer = null; // シンセBGM用のループタイマー
    this.bgmGain = null; // シンセBGM用のボリュームコントロール
  }

  // ユーザーの最初の操作（クリック/タップ）でAudioContextを初期化
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Safariなどのブラウザ制限により、サスペンド状態を解除する
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;

    // シンセBGMのボリューム切り替え
    if (this.bgmGain) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      const targetGain = this.enabled ? 0.08 : 0; // メイン音量を0.08に統一
      this.bgmGain.gain.setValueAtTime(targetGain, now);
    }

    // ファイルBGM (mp3) 用の切り替え
    if (!this.enabled && this.bgmAudio) {
      this.bgmAudio.pause();
    } else if (this.enabled && this.bgmAudio) {
      this.bgmAudio.play().catch(e => console.warn('BGM auto-play blocked', e));
    }
    return this.enabled;
  }

  // --- 効果音(SE) ---

  // ① ボタンクリック時の「ポッ」という音
  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // ② 正解時の「ピコーン！」という音
  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    osc.type = 'sine';
    
    // C5(523Hz) -> E5(659Hz) -> G5(784Hz) のアルペジオ風スイープ
    osc.frequency.setValueAtTime(523.25, now); 
    osc.frequency.setValueAtTime(659.25, now + 0.08); 
    osc.frequency.setValueAtTime(783.99, now + 0.16); 

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.setValueAtTime(0.15, now + 0.16);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // ③ 不正解時の「ブブー！」という音
  playWrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    const now = this.ctx.currentTime;
    // 不協和音を作るための少しずらした周波数（低いノコギリ波）
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, now);
    osc2.frequency.setValueAtTime(135, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
  }

  // ④ クイズ全問終了・バッジ獲得のファンファーレ
  playFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // ファンファーレ風に複数の音をずらして再生
    const playTone = (freq, start, duration, vol = 0.1) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.type = 'triangle'; // やさしい丸みのある音
      osc.frequency.setValueAtTime(freq, now + start);
      gain.gain.setValueAtTime(vol, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.start(now + start);
      osc.stop(now + start + duration);
    };

    playTone(523.25, 0, 0.15);     // ド
    playTone(587.33, 0.15, 0.15);  // レ
    playTone(659.25, 0.3, 0.15);   // ミ
    playTone(783.99, 0.45, 0.4, 0.15);  // ソ（高らかに）
    playTone(1046.50, 0.45, 0.4, 0.08); // 高いド
  }

  // --- BGM管理 ---
  startBgm() {
    if (this.bgmTimer) return; // すでにシンセBGMが開始されていればスルー

    this.init();

    // 1. すでにAudioContextがrunningであれば即座にスタート (自動再生許可環境)
    if (this.ctx && this.ctx.state === 'running') {
      if (this.enabled) {
        this.startSynthBgm();
      }
      return;
    }

    // 2. 自動再生制限がある場合は、ユーザーの最初のタップ/クリックで初期化・再生を開始する
    const startOnInteraction = () => {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          if (this.enabled && !this.bgmTimer) {
            this.startSynthBgm();
          }
        }).catch(e => console.warn('Failed to resume AudioContext:', e));
      } else if (this.enabled && !this.bgmTimer) {
        this.startSynthBgm();
      }
      
      // 一度トリガーしたらイベントリスナーを解除する
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);
  }

  // 宇宙的でワクワクするゲーム風8bitBGM（ピコピコ音楽）を合成してループ再生する
  startSynthBgm() {
    if (this.bgmTimer) return;
    this.init();
    if (!this.ctx) return;

    // BGMのメイン音量ノード (他の効果音を邪魔しない適度な音量)
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.enabled ? 0.08 : 0, this.ctx.currentTime); // 音量を0.08に統一
    this.bgmGain.connect(this.ctx.destination);

    // ドラム用の音量調整
    const drumGain = this.ctx.createGain();
    drumGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    drumGain.connect(this.bgmGain);

    // メロディ・ベース用の音量調整
    const synthGain = this.ctx.createGain();
    synthGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    synthGain.connect(this.bgmGain);

    // BPM136（8分音符 = 220ms）へスピードアップしてワクワク感を演出
    const stepTime = 0.22;
    let step = 0;

    // ワクワクするコード進行 (C -> G -> Am -> F)
    const roots = [130.81, 98.00, 110.00, 87.31]; // C2, G1, A1, F1 (ベース)
    const scale = [
      [261.63, 329.63, 392.00, 523.25], // Cメジャー (ドミソド)
      [196.00, 246.94, 293.66, 392.00], // G
      [220.00, 261.63, 329.63, 440.00], // Am
      [174.61, 220.00, 261.63, 349.23]  // F
    ];

    // メロディの8ビートアルペジオパターン
    const melodyPattern = [0, 1, 2, 1, 3, 2, 1, 2, 0, 1, 2, 3, 2, 1, 3, 0];

    const playStep = () => {
      // ミュート中の場合は処理をスキップ
      if (!this.enabled || !this.ctx) return;

      // サスペンド状態ならその場で解除を試みる
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const bar = Math.floor(step / 16) % 4; // 4小節パターン
      const stepInBar = step % 16;
      const rootFreq = roots[bar];
      const chordNotes = scale[bar];

      // --- 1. ベースライン ---
      if (stepInBar % 2 === 0) {
        const oscBase = this.ctx.createOscillator();
        const gainBase = this.ctx.createGain();
        
        oscBase.connect(gainBase);
        gainBase.connect(synthGain);

        oscBase.type = 'triangle';
        oscBase.frequency.setValueAtTime(rootFreq, now);

        gainBase.gain.setValueAtTime(0.7, now);
        gainBase.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        oscBase.start(now);
        oscBase.stop(now + 0.2);
      }

      // --- 2. ピコピコアルペジオメロディ ---
      const noteIdx = melodyPattern[stepInBar];
      const noteFreq = chordNotes[noteIdx] * 2; // 1オクターブ上

      const oscMelody = this.ctx.createOscillator();
      const gainMelody = this.ctx.createGain();
      
      oscMelody.connect(gainMelody);
      gainMelody.connect(synthGain);

      oscMelody.type = 'square'; // sineからsquareに変更してピコピコ感（8bit感）を演出
      oscMelody.frequency.setValueAtTime(noteFreq, now);

      gainMelody.gain.setValueAtTime(0.08, now); // squareは音が強いため音量を0.08に抑える
      gainMelody.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      oscMelody.start(now);
      oscMelody.stop(now + 0.15);

      // --- 3. 電子ドラム（キック） ---
      if (stepInBar === 0 || stepInBar === 8) {
        const oscKick = this.ctx.createOscillator();
        const gainKick = this.ctx.createGain();
        
        oscKick.connect(gainKick);
        gainKick.connect(drumGain);

        oscKick.type = 'sine';
        oscKick.frequency.setValueAtTime(150, now);
        oscKick.frequency.exponentialRampToValueAtTime(35, now + 0.12);

        gainKick.gain.setValueAtTime(0.8, now);
        gainKick.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        oscKick.start(now);
        oscKick.stop(now + 0.13);
      }

      // --- 4. 電子ドラム（ノイズスネア：2拍目＆4拍目） ---
      if (stepInBar === 4 || stepInBar === 12) {
        // 白ノイズの生成
        const bufferSize = this.ctx.sampleRate * 0.1; // 0.1秒分
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;
        const gainSnare = this.ctx.createGain();

        noiseNode.connect(gainSnare);
        gainSnare.connect(drumGain);

        // 「タン」というホワイトノイズスネア
        gainSnare.gain.setValueAtTime(0.12, now);
        gainSnare.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        noiseNode.start(now);
        noiseNode.stop(now + 0.11);
      }

      step++;
    };

    // 260msごとにステップを進める
    playStep();
    this.bgmTimer = setInterval(playStep, stepTime * 1000);
  }

  // --- BGMのダッキング（音声読み上げ時に音量を下げる） ---
  duckBgm() {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const targetGain = this.enabled ? 0.015 : 0;
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.linearRampToValueAtTime(targetGain, now + 0.2);
  }

  unduckBgm() {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const targetGain = this.enabled ? 0.08 : 0;
    this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
    this.bgmGain.gain.linearRampToValueAtTime(targetGain, now + 0.4);
  }
}

export const audio = new AudioService();
