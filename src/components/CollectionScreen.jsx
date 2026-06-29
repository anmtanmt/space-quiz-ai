import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';
import { BADGE_POOL, CATEGORIES } from '../utils/badges';

export default function CollectionScreen({ onBackToTitle }) {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setEarnedBadges(storage.getEarnedBadges());
  }, []);

  const totalBadges = BADGE_POOL.length;
  const earnedCount = earnedBadges.length;

  const handleBadgeClick = (badge) => {
    const earnedInfo = earnedBadges.find(b => b.id === badge.id);
    if (earnedInfo) {
      audio.playClick();
      setSelectedBadge({
        ...badge,
        count: earnedInfo.count || 1,
        earnedDates: earnedInfo.earnedDates || []
      });
    }
  };

  const filteredBadges = activeTab === 'all'
    ? BADGE_POOL
    : BADGE_POOL.filter(b => b.category === activeTab);

  return (
    <div className="collection-screen fade-in" style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏆 バッジコレクション</h1>
        <p style={styles.progressText}>
          {totalBadges}このうち <span style={styles.highlight}>{earnedCount}こ</span> あつまったよ！
        </p>
      </div>

      <div className="tab-container">
        {CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { audio.playClick(); setActiveTab(tab.id); }}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filteredBadges.map((badge) => {
          const earnedInfo = earnedBadges.find(b => b.id === badge.id);
          const isEarned = !!earnedInfo;
          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`badge-item ${isEarned ? 'earned' : 'locked'}`}
              style={{ position: 'relative' }}
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
              {isEarned && earnedInfo.count > 1 && (
                <span style={styles.badgeLoopCount}>×{earnedInfo.count}</span>
              )}
            </div>
          );
        })}
      </div>

      {selectedBadge && (
        <div style={styles.overlay} onClick={() => setSelectedBadge(null)}>
          <div className="star-pop" style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={{ ...styles.modalBadgeCircle, backgroundColor: selectedBadge.color }}>
              <span style={styles.modalBadgeEmoji}>{selectedBadge.emoji}</span>
            </div>
            <h2 style={styles.modalTitle}>{selectedBadge.name}</h2>
            <p style={styles.modalDesc}>{selectedBadge.desc}</p>
            
            <div style={styles.earnedStats}>
              <p style={styles.statsText}>
                🏅 ゲットした回数: <span style={styles.statsHighlight}>{selectedBadge.count}回</span>
              </p>
              {selectedBadge.earnedDates && selectedBadge.earnedDates.length > 0 && (
                <div style={styles.dateList}>
                  <p style={styles.dateTitle}>📅 ゲットした記念日:</p>
                  <ul style={styles.dates}>
                    {selectedBadge.earnedDates.slice(-3).map((date, idx) => (
                      <li key={idx} style={styles.dateItem}>• {date}</li>
                    ))}
                    {selectedBadge.earnedDates.length > 3 && (
                      <li style={styles.dateItem}>...ほかにもあるよ！</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button className="btn-action btn-primary" onClick={() => setSelectedBadge(null)} style={styles.closeBtn}>
              とじる
            </button>
          </div>
        </div>
      )}

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
    padding: '20px 20px 15px 20px',
    alignItems: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  title: {
    fontSize: '2.0rem',
    fontWeight: '800',
    color: '#fff',
    marginBottom: '4px',
  },
  progressText: {
    fontSize: '1.1rem',
    color: 'var(--color-text-sub)',
    fontWeight: '700',
  },
  highlight: {
    color: 'var(--color-primary)',
    fontSize: '1.4rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px',
    width: '100%',
    maxHeight: '380px',
    overflowY: 'auto',
    padding: '10px',
    flex: 1,
  },
  badgeCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '8px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
  badgeEmoji: {
    fontSize: '2.2rem',
  },
  badgeName: {
    fontSize: '0.8rem',
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeLoopCount: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: 'var(--color-accent)',
    color: '#000',
    fontSize: '0.7rem',
    fontWeight: '800',
    padding: '1px 5px',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  earnedStats: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '16px',
    padding: '12px 20px',
    width: '100%',
    marginBottom: '20px',
    textAlign: 'left',
  },
  statsText: {
    fontSize: '0.9rem',
    color: '#fff',
    fontWeight: '700',
    marginBottom: '6px',
  },
  statsHighlight: {
    color: 'var(--color-accent)',
    fontSize: '1.05rem',
  },
  dateList: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    paddingTop: '6px',
  },
  dateTitle: {
    fontSize: '0.8rem',
    color: 'var(--color-text-sub)',
    marginBottom: '4px',
    fontWeight: '700',
  },
  dates: {
    listStyle: 'none',
    paddingLeft: '0',
  },
  dateItem: {
    fontSize: '0.8rem',
    color: '#b0b5d0',
    marginBottom: '2px',
  },
  footer: {
    marginTop: '15px',
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
    padding: '24px',
    width: '90%',
    maxWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
  },
  modalBadgeCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '3.5rem',
    border: '4px solid #fff',
    marginBottom: '15px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  },
  modalBadgeEmoji: {
    lineHeight: '1',
  },
  modalTitle: {
    fontSize: '1.4rem',
    color: '#fff',
    fontWeight: '700',
    marginBottom: '8px',
  },
  modalDesc: {
    fontSize: '0.95rem',
    lineHeight: '1.5',
    color: '#b0b5d0',
    marginBottom: '16px',
  },
  closeBtn: {
    padding: '8px 24px',
    fontSize: '1.0rem',
  }
};
