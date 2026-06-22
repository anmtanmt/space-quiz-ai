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
      const targetGain = this.enabled ? 0.025 : 0; // メイン音量 (控えめ)
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

    const startOnInteraction = () => {
      this.init();
      if (this.enabled) {
        // 宇宙風シンセBGMの再生開始
        this.startSynthBgm();
      }
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };

    document.addEventListener('click', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);
  }

  // 宇宙的なアンビエントBGMを動的に合成して再生し続ける
  startSynthBgm() {
    if (this.bgmTimer) return;
    this.init();
    if (!this.ctx) return;

    // ボリュームノードを作成
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(this.enabled ? 0.025 : 0, this.ctx.currentTime);
    this.bgmGain.connect(this.ctx.destination);

    // ディレイノード（宇宙の残響感・エコー）
    const delay = this.ctx.createDelay(2.0);
    const delayFeedback = this.ctx.createGain();
    delay.delayTime.value = 0.8; // 0.8秒遅れて音が反響
    delayFeedback.gain.value = 0.35; // 響きの強さ（フィードバック）

    // ディレイのループ接続
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delayFeedback.connect(this.bgmGain);

    // 宇宙を漂うコード進行 (Cmaj7 -> Fmaj7 -> G6 -> Em7)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (ド, ミ, ソ, シ)
      [349.23, 440.00, 523.25, 659.25], // Fmaj7 (ファ, ラ, ド, ミ)
      [392.00, 493.88, 587.33, 659.25], // G6 (ソ, シ, レ, ミ)
      [329.63, 392.00, 493.88, 587.33]  // Em7 (ミ, ソ, シ, レ)
    ];

    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.ctx || (this.bgmGain && this.bgmGain.gain.value === 0)) return;

      const now = this.ctx.currentTime;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      // 各ノートをゆったりと鳴らす
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        
        osc.connect(noteGain);
        noteGain.connect(this.bgmGain);
        noteGain.connect(delay); // ディレイエフェクトにも送る

        osc.type = 'triangle'; // やさしい三角波
        osc.frequency.setValueAtTime(freq, now);

        // 宇宙の浮遊感を出すためのアタック(フェードイン)とリリース(フェードアウト)
        noteGain.gain.setValueAtTime(0, now);
        // 音が同時に鳴り始めないようにわずかにずらす（アルペジオ風）
        const noteStartDelay = idx * 0.15;
        noteGain.gain.linearRampToValueAtTime(0.05, now + 1.5 + noteStartDelay);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

        osc.start(now + noteStartDelay);
        osc.stop(now + 5.0);
      });
    };

    // 5.5秒ごとに次のコードをトリガー
    playNextChord();
    this.bgmTimer = setInterval(playNextChord, 5500);
  }
}

export const audio = new AudioService();
