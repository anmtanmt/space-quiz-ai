import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';

// 定義された全バッジのプール
const BADGE_POOL = [
  { id: 'badge_earth', name: 'ちきゅう バッジ', emoji: '🌏', color: '#4cc9f0', desc: 'あおくて うつくしい、ぼくたちの すむ ほしだよ！' },
  { id: 'badge_moon', name: 'つき バッジ', emoji: '🌙', color: '#ffb703', desc: 'よるに ちきゅうを てらしてくれる、いちばん ちかい ほし！' },
  { id: 'badge_sun', name: 'たいよう バッジ', emoji: '☀️', color: '#fb8500', desc: 'ちきゅうに ひかりと あたたかさを くれる、もえる ほし！' },
  { id: 'badge_saturn', name: 'どせい バッジ', emoji: '🪐', color: '#c5a059', desc: 'きれいな わ（リング）を もっている、ガスでできた ほし！' },
  { id: 'badge_mars', name: 'かせい バッジ', emoji: '🔴', color: '#ff4d6d', desc: 'あかい いしや スナに おおわれた、ちきゅうの おとなりの ほし！' },
  { id: 'badge_rocket', name: 'ロケット バッジ', emoji: '🚀', color: '#a2d2ff', desc: 'うちゅうへ とびだす、かっこいい のりもの！' },
  { id: 'badge_astronaut', name: 'うちゅうひこうし バッジ', emoji: '🧑‍🚀', color: '#b5e2fa', desc: 'うちゅうふくを きて、うちゅうで おしごとを する ひと！' },
  { id: 'badge_ufo', name: 'UFO バッジ', emoji: '🛸', color: '#66fcf1', desc: 'もしかしたら うちゅうじんが のっているかも しれない のりもの！' }
];

export default function ResultScreen({ score, total, onPlayAgain, onViewCollection, onBackToTitle }) {
  const [newBadge, setNewBadge] = useState(null);
  const [isNewBadgeEarned, setIsNewBadgeEarned] = useState(false);

  useEffect(() => {
    // 獲得済みのバッジリストを取得
    const earned = storage.getEarnedBadges();
    
    // まだ獲得していないバッジをリストアップ
    const unearned = BADGE_POOL.filter(b => !earned.includes(b.id));

    if (unearned.length > 0) {
      // 未獲得のものからランダムに1つ選んで獲得
      const randomBadge = unearned[Math.floor(Math.random() * unearned.length)];
      storage.addEarnedBadge(randomBadge.id);
      setNewBadge(randomBadge);
      setIsNewBadgeEarned(true);
    } else {
      // すべて獲得済みの場合は、既存のバッジからランダムで表示
      const randomBadge = BADGE_POOL[Math.floor(Math.random() * BADGE_POOL.length)];
      setNewBadge(randomBadge);
      setIsNewBadgeEarned(false);
    }

    // ファンファーレ音を再生
    audio.playFanfare();
  }, []);

  // スコアに応じたメッセージ決定
  const getFeedback = () => {
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
        <h1 style={styles.title}>クイズ おしまい！</h1>
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

      {/* ごほうびバッジ演出 */}
      {newBadge && (
        <div style={styles.badgeSection}>
          <p style={styles.badgeInstruction}>
            {isNewBadgeEarned 
              ? '🎁 新しい ごほうびバッジを もらったよ！' 
              : '🌟 すべての バッジを コンプリートしているよ！'}
          </p>
          <div className="badge-wrapper star-pop" style={styles.badgeWrapper}>
            <div style={{ ...styles.badgeCircle, backgroundColor: newBadge.color }}>
              <span style={styles.badgeEmoji}>{newBadge.emoji}</span>
            </div>
            <h3 style={styles.badgeName}>{newBadge.name}</h3>
            <p style={styles.badgeDesc}>{newBadge.desc}</p>
          </div>
        </div>
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
