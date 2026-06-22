// Web Audio API を使用した効果音・BGM管理クラス
// 外部音声ファイルがなくても、ブラウザの機能だけでシンセサイザーのように効果音を合成して鳴らします。

class AudioService {
  constructor() {
    this.ctx = null;
    this.enabled = true; // 音のON/OFF
    this.bgmAudio = null; // BGM用HTMLAudioElement
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
  // public/bgm.mp3 が配置されていればループ再生する
  startBgm() {
    if (this.bgmAudio) return; // すでに再生中の場合は何もしない

    this.bgmAudio = new Audio('/bgm.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.25; // やや小さめに再生

    if (this.enabled) {
      this.bgmAudio.play().catch(e => {
        // 初回のユーザーインタラクション前の自動再生ブロックへの対応
        console.warn('BGM play was blocked by browser. It will start upon user interaction.', e);
        
        // 代替として、ドキュメントの最初のクリックで再生を開始するワンタイムリスナーを登録
        const playOnInteraction = () => {
          this.init();
          if (this.enabled && this.bgmAudio) {
            this.bgmAudio.play().catch(err => console.error(err));
          }
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    }
  }
}

export const audio = new AudioService();
