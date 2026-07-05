import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';

export default function TitleScreen({ onStartQuiz, onViewCollection, onGoToParent }) {
  const [mode, setMode] = useState('ai'); // 'ai', 'parent', or 'test'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard' (or '4', '3' for test)
  const [hasParentQuizzes, setHasParentQuizzes] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(audio.enabled);

  useEffect(() => {
    const parentQuizzes = storage.getParentQuizzes();
    setHasParentQuizzes(parentQuizzes.length > 0);
    // BGMの起動待機（ユーザーの初回操作で再生されます）
    audio.startBgm();
  }, []);

  // モード切り替え時に適切なデフォルト難易度/級を設定する
  useEffect(() => {
    if (mode === 'test') {
      if (difficulty !== '4' && difficulty !== '3') {
        setDifficulty('4');
      }
    } else {
      if (difficulty === '4' || difficulty === '3') {
        setDifficulty('easy');
      }
    }
  }, [mode]);

  const handleToggleSound = () => {
    const nextState = audio.toggleSound();
    setSoundEnabled(nextState);
  };

  const handleStart = () => {
    audio.playClick();
    if (mode === 'parent' && !hasParentQuizzes) {
      alert('まだ「おとうさん・おかあさんの クイズ」が つくられていないよ！おとな用ページで クイズを つくってね。');
      return;
    }
    onStartQuiz(mode, difficulty);
  };

  return (
    <div className="title-screen fade-in" style={styles.container}>
      {/* 宇宙船と星のアニメーション演出用デコレーション */}
      <div className="space-rocket" style={styles.rocket}>🚀</div>

      <div style={styles.header}>
        <h1 style={styles.title}>
          <span style={styles.titleSub}>うちゅうクイズ</span><br />
          <span style={styles.titleMain}>宇宙クイズ-AI</span>
        </h1>
        <p style={styles.subtitle}>うちゅうの なぞに チャレンジしよう！</p>
      </div>

      <div style={styles.selectionSection}>
        {/* モード選択 */}
        <div style={styles.group}>
          <h2 style={styles.groupTitle}>🧭 クイズの モードを えらぼう</h2>
          <div style={styles.optionsRow}>
            <button
              onClick={() => { audio.playClick(); setMode('ai'); }}
              style={{
                ...styles.optionCard,
                ...(mode === 'ai' ? styles.optionCardActive : {})
              }}
            >
              <div style={styles.cardIcon}>🤖</div>
              <div style={styles.cardTitle}>AIの<br />ひみつクイズ</div>
              <div style={styles.cardDesc}>AIが 毎回（まいかい）新しく（あたらしく）つくるよ！</div>
            </button>

            <button
              onClick={() => { audio.playClick(); setMode('parent'); }}
              style={{
                ...styles.optionCard,
                ...(mode === 'parent' ? styles.optionCardActive : {}),
                ...(!hasParentQuizzes ? styles.disabledCard : {})
              }}
            >
              <div style={styles.cardIcon}>👨‍👩‍👧</div>
              <div style={styles.cardTitle}>おとうさん・<br />おかあさんのクイズ</div>
              <div style={styles.cardDesc}>
                {hasParentQuizzes 
                  ? 'おうちの人が つくってくれた クイズだよ！' 
                  : '（まだクイズが 登録（とうろく）されていません）'}
              </div>
            </button>

            <button
              onClick={() => { audio.playClick(); setMode('test'); }}
              style={{
                ...styles.optionCard,
                ...(mode === 'test' ? styles.optionCardActive : {})
              }}
            >
              <div style={styles.cardIcon}>🎓</div>
              <div style={styles.cardTitle}>てんもん<br />宇宙けんてい</div>
              <div style={styles.cardDesc}>
                ほんかく的な 検定（けんてい）に チャレンジできるよ！
              </div>
            </button>
          </div>
        </div>

        {/* 難易度・級の選択 */}
        <div style={styles.group}>
          {mode === 'test' ? (
            <>
              <h2 style={styles.groupTitle}>⭐ チャレンジする きゅうを えらぼう</h2>
              <div style={styles.optionsRow}>
                <button
                  onClick={() => { audio.playClick(); setDifficulty('4'); }}
                  style={{
                    ...styles.diffCard,
                    ...styles.diffEasy,
                    ...(difficulty === '4' ? styles.diffActive : {})
                  }}
                >
                  <div style={styles.diffLabel}>4きゅう</div>
                  <div style={styles.diffTarget}>（星空はかせ★やさしい）</div>
                </button>

                <button
                  onClick={() => { audio.playClick(); setDifficulty('3'); }}
                  style={{
                    ...styles.diffCard,
                    ...styles.diffMedium,
                    ...(difficulty === '3' ? styles.diffActive : {})
                  }}
                >
                  <div style={styles.diffLabel}>3きゅう</div>
                  <div style={styles.diffTarget}>（星空じゅんあんないにん）</div>
                </button>

                <button
                  disabled
                  style={{
                    ...styles.diffCard,
                    ...styles.comingSoonCard
                  }}
                >
                  <div style={styles.diffLabel}>2きゅう</div>
                  <div style={styles.diffTarget}>（Coming Soon）</div>
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.groupTitle}>⭐ むずかしさを えらぼう</h2>
              <div style={styles.optionsRow}>
                <button
                  onClick={() => { audio.playClick(); setDifficulty('easy'); }}
                  style={{
                    ...styles.diffCard,
                    ...styles.diffEasy,
                    ...(difficulty === 'easy' ? styles.diffActive : {})
                  }}
                >
                  <div style={styles.diffLabel}>やさしい</div>
                  <div style={styles.diffTarget}>（ようちえん・ほいくえん）</div>
                </button>

                <button
                  onClick={() => { audio.playClick(); setDifficulty('medium'); }}
                  style={{
                    ...styles.diffCard,
                    ...styles.diffMedium,
                    ...(difficulty === 'medium' ? styles.diffActive : {})
                  }}
                >
                  <div style={styles.diffLabel}>ふつう</div>
                  <div style={styles.diffTarget}>（しょうがっこう ていがくねん）</div>
                </button>

                <button
                  onClick={() => { audio.playClick(); setDifficulty('hard'); }}
                  style={{
                    ...styles.diffCard,
                    ...styles.diffHard,
                    ...(difficulty === 'hard' ? styles.diffActive : {})
                  }}
                >
                  <div style={styles.diffLabel}>むずかしい</div>
                  <div style={styles.diffTarget}>（もっと しりたい 子向け）</div>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* アクションボタン */}
      <div style={styles.actionRow}>
        <button className="btn-action btn-accent" onClick={handleStart} style={styles.startButton}>
          🎮 クイズを はじめる！🚀
        </button>
        <button 
          className="btn-action btn-back" 
          onClick={() => { audio.playClick(); onViewCollection(); }} 
          style={styles.collectionButton}
        >
          🏆 バッジを みる
        </button>
      </div>

      {/* 音量切り替えフローティングボタン */}
      <button onClick={handleToggleSound} style={styles.soundButton}>
        {soundEnabled ? '🔊 おとON' : '🔇 おとOFF'}
      </button>

      {/* おとな用ページへのひっそりとしたボタン */}
      <div style={styles.footer}>
        <button onClick={() => { audio.playClick(); onGoToParent(); }} style={styles.parentButton}>
          ⚙️ おとな用の ページ
        </button>
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
    padding: '30px 30px 20px 30px',
    alignItems: 'center',
    position: 'relative',
  },
  rocket: {
    position: 'absolute',
    fontSize: '3rem',
    top: '20px',
    right: '50px',
    animation: 'rocketFloat 4s ease-in-out infinite alternate',
    pointerEvents: 'none'
  },
  soundButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '12px',
    padding: '8px 12px',
    color: '#fff',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(102, 252, 241, 0.1)'
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: '12px',
  },
  title: {
    lineHeight: '1.2',
  },
  titleSub: {
    fontSize: '1.25rem',
    color: 'var(--color-text-sub)',
    fontWeight: '700',
  },
  titleMain: {
    fontSize: '3.0rem',
    fontWeight: '800',
    background: 'linear-gradient(to right, #66fcf1, #ffb703)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '0 0 30px rgba(102, 252, 241, 0.3)',
  },
  subtitle: {
    marginTop: '4px',
    fontSize: '1.1rem',
    color: '#a0a5c0',
  },
  selectionSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  group: {
    width: '100%',
  },
  groupTitle: {
    fontSize: '1.05rem',
    color: 'var(--color-text-sub)',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: '700',
  },
  optionsRow: {
    display: 'flex',
    gap: '20px',
    width: '100%',
  },
  optionCard: {
    flex: 1,
    background: 'var(--color-card-bg)',
    border: '2px solid var(--color-card-border)',
    borderRadius: '20px',
    padding: '16px 12px',
    cursor: 'pointer',
    color: '#fff',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  optionCardActive: {
    borderColor: 'var(--color-primary)',
    background: 'rgba(102, 252, 241, 0.12)',
    boxShadow: '0 0 25px rgba(102, 252, 241, 0.25)',
    transform: 'translateY(-2px)',
  },
  disabledCard: {
    opacity: 0.6,
  },
  comingSoonCard: {
    opacity: 0.45,
    cursor: 'not-allowed',
    borderStyle: 'dashed',
    background: 'rgba(255, 255, 255, 0.02)'
  },
  cardIcon: {
    fontSize: '2.2rem',
    marginBottom: '8px',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '0.8rem',
    color: '#a0a5c0',
    lineHeight: '1.4',
  },
  diffCard: {
    flex: 1,
    padding: '12px 10px',
    borderRadius: '16px',
    border: '2px solid var(--color-card-border)',
    background: 'var(--color-card-bg)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    color: '#fff',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  diffActive: {
    borderColor: 'var(--color-primary)',
    background: 'rgba(102, 252, 241, 0.12)',
    boxShadow: '0 0 25px rgba(102, 252, 241, 0.25)',
    transform: 'translateY(-2px)',
  },
  diffEasy: {
    borderLeft: '8px solid var(--color-correct)',
  },
  diffMedium: {
    borderLeft: '8px solid var(--color-accent)',
  },
  diffHard: {
    borderLeft: '8px solid var(--color-wrong)',
  },
  diffLabel: {
    fontSize: '1.20rem',
    fontWeight: '700',
    marginBottom: '4px',
  },
  diffTarget: {
    fontSize: '0.72rem',
    color: '#a0a5c0',
  },
  actionRow: {
    display: 'flex',
    gap: '24px',
    marginTop: '15px',
    width: '100%',
    maxWidth: '600px',
  },
  startButton: {
    flex: 2,
    fontSize: '1.4rem',
    padding: '16px',
  },
  collectionButton: {
    flex: 1,
    fontSize: '1.1rem',
  },
  footer: {
    marginTop: '15px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  parentButton: {
    background: 'none',
    border: 'none',
    color: '#606580',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-family)',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'color 0.2s',
  }
};

// CSS Keyframes 用のスタイル流し込み
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @keyframes rocketFloat {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(-15px) rotate(5deg); }
    }
  `;
  document.head.appendChild(styleEl);
}
