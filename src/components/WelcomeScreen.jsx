import React from 'react';
import { audio } from '../utils/audio';

export default function WelcomeScreen({ onStartApp }) {
  const handleStart = () => {
    // ユーザーインタラクションによりオーディオを初期化・開始
    audio.init();
    audio.startBgm();
    audio.playClick();
    onStartApp();
  };

  return (
    <div style={styles.container} className="welcome-screen fade-in">
      {/* 宇宙空間のまたたく星の装飾 */}
      <div style={styles.planetBg}>🪐</div>
      <div style={styles.ufoBg}>🛸</div>

      <div style={styles.logoContainer}>
        <div style={styles.rocket}>🚀</div>
        <h1 style={styles.title}>
          <span style={styles.titleSub}>うちゅうの なぞに チャレンジ！</span><br />
          <span style={styles.titleMain}>宇宙クイズ-AI</span>
        </h1>
        <p style={styles.description}>
          AI（えーあい）がつくる、きみだけのクイズ！
        </p>
      </div>

      <button onClick={handleStart} style={styles.startButton} className="btn-action btn-accent">
        クイズをはじめる！🚀
      </button>

      <div style={styles.footer}>
        © 宇宙クイズ-AI
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '60px 30px 40px 30px',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  planetBg: {
    position: 'absolute',
    fontSize: '6rem',
    bottom: '-20px',
    left: '-20px',
    opacity: 0.3,
    animation: 'spinPlanet 20s linear infinite',
    pointerEvents: 'none',
  },
  ufoBg: {
    position: 'absolute',
    fontSize: '4rem',
    top: '10%',
    left: '10%',
    opacity: 0.25,
    animation: 'ufoFloat 6s ease-in-out infinite alternate',
    pointerEvents: 'none',
  },
  rocket: {
    fontSize: '4.5rem',
    marginBottom: '20px',
    animation: 'rocketFloatWelcome 3s ease-in-out infinite alternate',
    display: 'inline-block',
  },
  logoContainer: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    lineHeight: '1.3',
    marginBottom: '24px',
  },
  titleSub: {
    fontSize: '1.4rem',
    color: '#66fcf1',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  titleMain: {
    fontSize: '4rem',
    fontWeight: '800',
    background: 'linear-gradient(to right, #66fcf1, #ffb703)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 40px rgba(102, 252, 241, 0.4)',
  },
  description: {
    fontSize: '1.2rem',
    color: '#a0a5c0',
    lineHeight: '1.6',
    fontWeight: '500',
  },
  volumeIcon: {
    display: 'inline-block',
    animation: 'pulseVolume 1.5s ease-in-out infinite',
  },
  startButton: {
    fontSize: '1.8rem',
    padding: '20px 50px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '800',
    boxShadow: '0 0 30px rgba(255, 183, 3, 0.4)',
    border: 'none',
    zIndex: 2,
    transition: 'all 0.2s ease',
  },
  footer: {
    fontSize: '0.85rem',
    color: '#4f5470',
    zIndex: 1,
  }
};

// CSS Keyframes 用のスタイル流し込み
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes rocketFloatWelcome {
      0% { transform: translateY(0) rotate(-5deg); }
      100% { transform: translateY(-20px) rotate(5deg); }
    }
    @keyframes spinPlanet {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes ufoFloat {
      0% { transform: translateY(0) translateX(0) rotate(0deg); }
      100% { transform: translateY(-10px) translateX(15px) rotate(10deg); }
    }
    @keyframes pulseVolume {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
  `;
  document.head.appendChild(styleEl);
}
