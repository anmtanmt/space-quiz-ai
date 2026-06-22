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

export default function CollectionScreen({ onBackToTitle }) {
  const [earnedBadgeIds, setEarnedBadgeIds] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    setEarnedBadgeIds(storage.getEarnedBadges());
  }, []);

  const totalBadges = BADGE_POOL.length;
  const earnedCount = earnedBadgeIds.length;

  const handleBadgeClick = (badge) => {
    if (earnedBadgeIds.includes(badge.id)) {
      audio.playClick();
      setSelectedBadge(badge);
    }
  };

  return (
    <div className="collection-screen fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 バッジコレクション</h1>
        <p style={styles.progressText}>
          {totalBadges}このうち <span style={styles.highlight}>{earnedCount}こ</span> あつまったよ！
        </p>
      </div>

      {/* バッジグリッド */}
      <div style={styles.grid}>
        {BADGE_POOL.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
            >
              <div
                style={{
                  ...styles.badgeCircle,
                  backgroundColor: isEarned ? badge.color : 'rgba(255, 255, 255, 0.05)',
                  border: isEarned ? '3px solid #fff' : '2px dashed rgba(255, 255, 255, 0.15)'
                }}
              >
                <span style={{
                  ...styles.badgeEmoji,
                  filter: isEarned ? 'none' : 'grayscale(100%) opacity(0.3)'
                }}>
                  {isEarned ? badge.emoji : '❓'}
                </span>
              </div>
              <span style={{
                ...styles.badgeName,
                color: isEarned ? '#fff' : 'rgba(255, 255, 255, 0.3)'
              }}>
                {isEarned ? badge.name : '？？？'}
              </span>
            </div>
          );
        })}
      </div>

      {/* バッジ詳細エリア（ポップアップ） */}
      {selectedBadge && (
        <div style={styles.overlay} onClick={() => setSelectedBadge(null)}>
          <div className="star-pop" style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ ...styles.modalBadgeCircle, backgroundColor: selectedBadge.color }}>
              <span style={styles.modalBadgeEmoji}>{selectedBadge.emoji}</span>
            </div>
            <h2 style={styles.modalTitle}>{selectedBadge.name}</h2>
            <p style={styles.modalDesc}>{selectedBadge.desc}</p>
            <button className="btn-action btn-primary" onClick={() => setSelectedBadge(null)} style={styles.closeBtn}>
              とじる
            </button>
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      <div style={styles.footer}>
        <button className="btn-action btn-back" onClick={() => { audio.playClick(); onBackToTitle(); }}>
          ⬅ タイトルにもどる
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
    padding: '30px 20px 20px 20px',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '8px',
  },
  progressText: {
    fontSize: '1.2rem',
    color: 'var(--color-text-sub)',
    fontWeight: '700',
  },
  highlight: {
    color: 'var(--color-primary)',
    fontSize: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    width: '100%',
    maxHeight: '420px',
    overflowY: 'auto',
    padding: '10px',
  },
  // styles.badgeItem, styles.badgeItemEarned, styles.badgeItemLocked are removed to index.css
  badgeCircle: {
    width: '75px',
    height: '75px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  badgeEmoji: {
    fontSize: '2.5rem',
  },
  badgeName: {
    fontSize: '0.85rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  footer: {
    marginTop: '20px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(5, 5, 15, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: 'rgba(15, 15, 35, 0.95)',
    border: '3px solid var(--color-primary)',
    borderRadius: '28px',
    padding: '30px',
    width: '90%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
  },
  modalBadgeCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '4rem',
    border: '4px solid #fff',
    marginBottom: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  modalBadgeEmoji: {
    lineHeight: '1',
  },
  modalTitle: {
    fontSize: '1.6rem',
    color: '#fff',
    fontWeight: '700',
    marginBottom: '10px',
  },
  modalDesc: {
    fontSize: '1.05rem',
    lineHeight: '1.6',
    color: '#b0b5d0',
    marginBottom: '24px',
  },
  closeBtn: {
    padding: '10px 30px',
    fontSize: '1.1rem',
  }
};
