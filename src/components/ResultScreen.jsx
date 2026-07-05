import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';
import { BADGE_POOL } from '../utils/badges';

export default function ResultScreen({ score, total, mode = 'ai', difficulty = 'easy', onPlayAgain, onViewCollection, onBackToTitle }) {
  const [newBadge, setNewBadge] = useState(null);
  const [isNewBadgeEarned, setIsNewBadgeEarned] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isTestPassed, setIsTestPassed] = useState(false);

  useEffect(() => {
    const testModeActive = mode === 'test';
    setIsTestMode(testModeActive);

    if (testModeActive) {
      // 天文宇宙検定モード
      const passed = score >= 4; // 5問中4問以上で合格
      setIsTestPassed(passed);

      if (passed) {
        // 合格！対応する級のバッジを付与
        const badgeId = difficulty === '3' ? 'b_test_3' : 'b_test_4';
        const targetBadge = BADGE_POOL.find(b => b.id === badgeId);

        if (targetBadge) {
          const result = storage.addEarnedBadge(targetBadge.id);
          setNewBadge({
            ...targetBadge,
            count: result ? result.count : 1
          });
          setIsNewBadgeEarned(result ? result.count === 1 : true);
        }
      }
    } else {
      // 通常のクイズモード（3問以上正解したときだけバッジをごほうびとして獲得できる）
      if (score >= 3) {
        const earned = storage.getEarnedBadges();
        const earnedIds = earned.map(b => b.id);
        
        // まだ獲得していないバッジをリストアップ（検定用バッジは除外）
        const unearned = BADGE_POOL.filter(b => !earnedIds.includes(b.id) && b.category !== 'test');

        let selected = null;
        let isNew = false;

        if (unearned.length > 0) {
          // 未獲得のものからランダムに1つ選んで獲得
          selected = unearned[Math.floor(Math.random() * unearned.length)];
          isNew = true;
        } else {
          // すべて獲得済みの場合は、既存の通常バッジからランダムで選んで再度獲得（2周目対応）
          const normalBadges = BADGE_POOL.filter(b => b.category !== 'test');
          selected = normalBadges[Math.floor(Math.random() * normalBadges.length)];
          isNew = false;
        }

        if (selected) {
          const result = storage.addEarnedBadge(selected.id);
          setNewBadge({
            ...selected,
            count: result ? result.count : 1
          });
          setIsNewBadgeEarned(isNew);
        }
      }
    }

    // ファンファーレ音を再生
    audio.playFanfare();
  }, [score, mode, difficulty]);

  // スコアに応じたメッセージ決定
  const getFeedback = () => {
    if (mode === 'test') {
      const gradeText = difficulty === '3' ? '3きゅう' : '4きゅう';
      if (score >= 4) {
        return {
          text: `おめでとう！ てんもん宇宙けんてい ${gradeText} に「ごうかく」したよ！ 🎓`,
          color: 'var(--color-accent)'
        };
      } else {
        return {
          text: `おしい！ あとすこしで ごうかく だったね。また チャレンジしよう！ 🔥`,
          color: '#a0a5c0'
        };
      }
    }

    if (score === total) return { text: 'パーフェクト！ うちゅうはかせだね！ 👑', color: 'var(--color-accent)' };
    if (score >= total - 2) return { text: 'すごい！ うちゅうの ことが よくわかったね！ 🌟', color: 'var(--color-primary)' };
    if (score > 0) return { text: 'がんばったね！ つぎは もっと せいかいできるよ！ 🚀', color: '#fff' };
    return { text: 'チャレンジして えらい！ つぎも がんばろう！ 💪', color: '#a0a5c0' };
  };

  const feedback = getFeedback();

  return (
    <div className="result-screen fade-in" style={styles.container}>
      {/* 祝賀用アニメーションスター背景 */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          {mode === 'test' ? 'けんてい おしまい！' : 'クイズ おしまい！'}
        </h1>
        <p style={{ ...styles.feedbackText, color: feedback.color }}>{feedback.text}</p>
      </div>

      {/* スコア表示 */}
      <div style={styles.scoreContainer}>
        <div style={styles.scoreCircle}>
          <span style={styles.scoreNumber}>{score}</span>
          <span style={styles.scoreTotal}>/ {total}</span>
          <span style={styles.scoreUnit}>もん せいかい！</span>
        </div>
      </div>

      {/* ごほうびバッジ演出、または励まし表示 */}
      {isTestMode ? (
        isTestPassed ? (
          newBadge && (
            <div style={styles.badgeSection}>
              <p style={styles.badgeInstruction}>
                {isNewBadgeEarned 
                  ? '🏅 合格おめでとう！ 合格バッジを ゲットしたよ！' 
                  : `🌟 ${newBadge.count}かいめの 合格だ！`}
              </p>
              <div className="badge-wrapper star-pop" style={styles.badgeWrapper}>
                <div style={{ ...styles.badgeCircle, backgroundColor: newBadge.color }}>
                  <span style={styles.badgeEmoji}>{newBadge.emoji}</span>
                </div>
                <h3 style={styles.badgeName}>
                  {newBadge.name} {newBadge.count > 1 && `×${newBadge.count}`}
                </h3>
                <p style={styles.badgeDesc}>{newBadge.desc}</p>
              </div>
            </div>
          )
        ) : (
          <div style={styles.badgeSection}>
            <p style={styles.badgeInstruction}>🔒 合格バッジ</p>
            <div style={styles.badgeWrapper}>
              <div style={{ ...styles.badgeCircle, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '2px dashed rgba(255, 255, 255, 0.15)' }}>
                <span style={{ ...styles.badgeEmoji, filter: 'grayscale(100%) opacity(0.3)' }}>🔒</span>
              </div>
              <h3 style={{ ...styles.badgeName, color: 'rgba(255, 255, 255, 0.4)' }}>？？？ 合格バッジ</h3>
              <p style={{ ...styles.badgeDesc, color: 'var(--color-accent)', fontWeight: '700' }}>
                5もんのうち 4もんいじょう せいかいすると「ごうかく」バッジが もらえるよ！
              </p>
            </div>
          </div>
        )
      ) : (
        score >= 3 ? (
          newBadge && (
            <div style={styles.badgeSection}>
              <p style={styles.badgeInstruction}>
                {isNewBadgeEarned 
                  ? '🎁 新しい ごほうびバッジを もらったよ！' 
                  : `🌟 ${newBadge.count}こめの ${newBadge.name}を ゲットしたよ！`}
              </p>
              <div className="badge-wrapper star-pop" style={styles.badgeWrapper}>
                <div style={{ ...styles.badgeCircle, backgroundColor: newBadge.color }}>
                  <span style={styles.badgeEmoji}>{newBadge.emoji}</span>
                </div>
                <h3 style={styles.badgeName}>
                  {newBadge.name} {newBadge.count > 1 && `×${newBadge.count}`}
                </h3>
                <p style={styles.badgeDesc}>{newBadge.desc}</p>
              </div>
            </div>
          )
        ) : (
          <div style={styles.badgeSection}>
            <p style={styles.badgeInstruction}>🔒 ごほうびバッジ</p>
            <div style={styles.badgeWrapper}>
              <div style={{ ...styles.badgeCircle, backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '2px dashed rgba(255, 255, 255, 0.15)' }}>
                <span style={{ ...styles.badgeEmoji, filter: 'grayscale(100%) opacity(0.3)' }}>🔒</span>
              </div>
              <h3 style={{ ...styles.badgeName, color: 'rgba(255, 255, 255, 0.4)' }}>？？？ バッジ</h3>
              <p style={{ ...styles.badgeDesc, color: 'var(--color-accent)', fontWeight: '700' }}>
                3もん いじょう せいかい すると、ごほうびバッジが もらえるよ！ つぎは がんばろう！ 🔥
              </p>
            </div>
          </div>
        )
      )}

      {/* ナビゲーションボタン */}
      <div style={styles.actionRow}>
        <button 
          className="btn-action btn-primary" 
          onClick={() => { audio.playClick(); onPlayAgain(); }} 
          style={styles.actionBtn}
        >
          🔄 もういちど あそぶ
        </button>
        <button 
          className="btn-action btn-accent" 
          onClick={() => { audio.playClick(); onViewCollection(); }} 
          style={styles.actionBtn}
        >
          🏆 バッジコレクション
        </button>
        <button 
          className="btn-action btn-back" 
          onClick={() => { audio.playClick(); onBackToTitle(); }} 
          style={styles.actionBtn}
        >
          🏠 タイトルにもどる
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
    alignItems: 'center',
    padding: '30px 20px 20px 20px',
  },
  header: {
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '10px',
  },
  feedbackText: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  scoreContainer: {
    margin: '15px 0',
  },
  scoreCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    border: '4px solid var(--color-primary)',
    background: 'rgba(102, 252, 241, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 30px rgba(102, 252, 241, 0.2)',
  },
  scoreNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    color: 'var(--color-primary)',
    lineHeight: '1',
  },
  scoreTotal: {
    fontSize: '1.2rem',
    color: 'var(--color-text-sub)',
    marginBottom: '4px',
  },
  scoreUnit: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#fff',
  },
  badgeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '24px',
    padding: '20px',
    width: '100%',
    maxWidth: '500px',
  },
  badgeInstruction: {
    fontSize: '0.95rem',
    color: 'var(--color-text-sub)',
    marginBottom: '12px',
    fontWeight: '700',
  },
  badgeWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  badgeCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '3.5rem',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
    marginBottom: '12px',
    border: '3px solid #fff',
  },
  badgeEmoji: {
    lineHeight: '1',
  },
  badgeName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '6px',
  },
  badgeDesc: {
    fontSize: '0.9rem',
    color: '#a0a5c0',
    lineHeight: '1.4',
    padding: '0 10px',
  },
  actionRow: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    maxWidth: '650px',
    marginTop: '15px',
  },
  actionBtn: {
    flex: 1,
    padding: '14px 10px',
    fontSize: '1.05rem',
  }
};
