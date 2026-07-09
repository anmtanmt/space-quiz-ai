import React, { useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';
import { BADGE_POOL, CATEGORIES, getDynamicBadgeInfo, getBadgeBorderColor, DIFFICULTY_MAP, MODE_MAP, getProjectStatus, PROJECT_IMAGE_MAP } from '../utils/badges';

export default function CollectionScreen({ onBackToTitle }) {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isPhotoMaximized, setIsPhotoMaximized] = useState(false);

  useEffect(() => {
    setEarnedBadges(storage.getEarnedBadges());
  }, []);

  const totalBadges = BADGE_POOL.length;
  const earnedCount = earnedBadges.length;

  const handleBadgeClick = (badge) => {
    const earnedInfo = earnedBadges.find(b => b.id === badge.id);
    if (earnedInfo) {
      audio.playClick();
      const dynamicBadge = getDynamicBadgeInfo(badge, earnedInfo.count);
      setSelectedBadge({
        ...dynamicBadge,
        count: earnedInfo.count || 1,
        earnedDates: earnedInfo.earnedDates || [],
        earnedDetails: earnedInfo.earnedDetails || [],
        borderColor: getBadgeBorderColor(earnedInfo)
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

      {activeTab === 'test' ? (
        <div style={styles.testContainer}>
          {/* 4級（やさしい）と3級（ふつう）の設計図を表示 */}
          {['b_test_4', 'b_test_3'].map((badgeId) => {
            const badge = BADGE_POOL.find(b => b.id === badgeId);
            const earnedInfo = earnedBadges.find(b => b.id === badgeId);
            const count = earnedInfo ? earnedInfo.count : 0;
            const status = getProjectStatus(badgeId, count);

            if (!status) return null;

            return (
              <div key={badgeId} style={styles.blueprintCard}>
                <div style={styles.blueprintHeader}>
                  <h3 style={styles.blueprintGrade}>
                    {badgeId === 'b_test_4' ? '🎓 4きゅう（やさしい）設計図' : '🎓 3きゅう（ふつう）設計図'}
                  </h3>
                  <p style={styles.blueprintSub}>ごうかくした回数: <span style={styles.highlight}>{count}回</span></p>
                </div>

                {/* 現在のプロジェクト */}
                <div style={styles.currentProjectBox}>
                  <h4 style={styles.projectTitle}>
                    {status.isAllCompleted 
                      ? '🎉 すべてのプロジェクトが かんせいしたぞ！' 
                      : `🛠️ プロジェクト：${status.currentProject.name} をつくろう！`}
                  </h4>

                  <div style={styles.partsRow}>
                    {status.currentProject.parts.map((part, idx) => {
                      const isCompleteItem = idx === 4;
                      // パーツが獲得済みかどうか（idx <= status.currentPartIndex かつ合格回数 > 0）
                      const isUnlocked = count > 0 && idx <= status.currentPartIndex;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (isUnlocked) {
                              audio.playClick();
                              setSelectedBadge({
                                name: isCompleteItem 
                                  ? `${status.currentProject.name}（かんせい！）`
                                  : `${status.currentProject.name}の ${part.name}`,
                                emoji: part.emoji,
                                desc: part.desc,
                                color: badge.color,
                                count: 1,
                                image: isCompleteItem 
                                  ? '/images/' + PROJECT_IMAGE_MAP[status.currentProject.id] 
                                  : null,
                                earnedDetails: earnedInfo ? earnedInfo.earnedDetails.filter((d, detailIdx) => {
                                  // このパーツを獲得した合格回数に対応する履歴のみを表示
                                  const targetPassNum = status.currentProjectIndex * 5 + idx + 1;
                                  return (detailIdx + 1) === targetPassNum;
                                }) : []
                              });
                            }
                          }}
                          style={{
                            ...styles.partSlot,
                            border: isUnlocked
                              ? `2px solid ${badgeId === 'b_test_3' ? '#3a86ff' : '#ffd166'}`
                              : '2px dashed rgba(255, 255, 255, 0.12)',
                            background: isUnlocked
                              ? 'rgba(255, 255, 255, 0.04)'
                              : 'rgba(255, 255, 255, 0.01)',
                            cursor: isUnlocked ? 'pointer' : 'default',
                            ...(isCompleteItem ? styles.completeSlotSpecial : {})
                          }}
                        >
                          <span style={{
                            ...styles.partEmoji,
                            filter: isUnlocked ? 'none' : 'grayscale(100%) opacity(0.2)'
                          }}>
                            {isUnlocked ? part.emoji : '❓'}
                          </span>
                          <span style={{
                            ...styles.partName,
                            color: isUnlocked ? '#fff' : 'rgba(255, 255, 255, 0.3)'
                          }}>
                            {isUnlocked ? (isCompleteItem ? 'かんせい！' : part.name) : '？？？'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* かんせいリスト */}
                {status.completedList.length > 0 && (
                  <div style={styles.completedSection}>
                    <h5 style={styles.completedSectionTitle}>🛠️ かんせいリスト:</h5>
                    <div style={styles.completedList}>
                      {status.completedList.map((comp) => (
                        <div
                          key={comp.id}
                          onClick={() => {
                            audio.playClick();
                            // 完成品の合格履歴（5回分）
                            const passStart = comp.projectIndex * 5;
                            const passEnd = passStart + 5;
                            const projDetails = earnedInfo 
                              ? earnedInfo.earnedDetails.slice(passStart, passEnd)
                              : [];
                            setSelectedBadge({
                              name: comp.name + '（かんせい！）',
                              emoji: comp.emoji,
                              desc: comp.desc,
                              color: comp.color,
                              count: 1,
                              image: comp.image,
                              earnedDetails: projDetails
                            });
                          }}
                          style={styles.completedItem}
                        >
                          <span style={styles.completedEmoji}>{comp.emoji}</span>
                          <span style={styles.completedName}>{comp.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredBadges.map((badge) => {
            const earnedInfo = earnedBadges.find(b => b.id === badge.id);
            const isEarned = !!earnedInfo;
            const dynamicBadge = isEarned ? getDynamicBadgeInfo(badge, earnedInfo.count) : badge;
            const borderColor = getBadgeBorderColor(earnedInfo);

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
                    backgroundColor: isEarned ? dynamicBadge.color : 'rgba(255, 255, 255, 0.05)',
                    border: isEarned ? `3px solid ${borderColor}` : '2px dashed rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <span style={{
                    ...styles.badgeEmoji,
                    filter: isEarned ? 'none' : 'grayscale(100%) opacity(0.3)'
                  }}>
                    {isEarned ? dynamicBadge.emoji : '❓'}
                  </span>
                </div>
                <span style={{
                  ...styles.badgeName,
                  color: isEarned ? '#fff' : 'rgba(255, 255, 255, 0.3)'
                }}>
                  {isEarned ? dynamicBadge.name : '？？？'}
                </span>
                {isEarned && earnedInfo.count > 1 && (
                  <span style={styles.badgeLoopCount}>×{earnedInfo.count}</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedBadge && (
        <div style={styles.overlay} onClick={() => { setSelectedBadge(null); setIsPhotoMaximized(false); }}>
          <div className="star-pop" style={styles.modal} onClick={e => e.stopPropagation()}>
            
            {selectedBadge.image ? (
              <div 
                style={styles.realPhotoContainer} 
                onClick={() => { audio.playClick(); setIsPhotoMaximized(true); }}
                title="タップすると おおきくなるよ！"
              >
                <img src={selectedBadge.image} alt={selectedBadge.name} style={styles.realPhoto} />
                <div style={styles.zoomHint}>🔍 タップでおおきくなるよ！</div>
              </div>
            ) : (
              <div style={{ 
                ...styles.modalBadgeCircle, 
                backgroundColor: selectedBadge.color,
                borderColor: selectedBadge.borderColor || '#fff'
              }}>
                <span style={styles.modalBadgeEmoji}>{selectedBadge.emoji}</span>
              </div>
            )}

            <h2 style={styles.modalTitle}>{selectedBadge.name}</h2>
            <p style={styles.modalDesc}>{selectedBadge.desc}</p>
            
            <div style={styles.earnedStats}>
              <p style={styles.statsText}>
                🏅 ゲットした回数: <span style={styles.statsHighlight}>{selectedBadge.count}回</span>
              </p>
              {selectedBadge.earnedDetails && selectedBadge.earnedDetails.length > 0 && (
                <div style={styles.dateList}>
                  <p style={styles.dateTitle}>📅 ゲットした記念日:</p>
                  <ul style={styles.dates}>
                    {selectedBadge.earnedDetails.slice(-3).map((detail, idx) => (
                      <li key={idx} style={styles.dateItem}>
                        • {detail.date} - {DIFFICULTY_MAP[detail.difficulty] || detail.difficulty} ({MODE_MAP[detail.mode] || detail.mode})
                      </li>
                    ))}
                    {selectedBadge.earnedDetails.length > 3 && (
                      <li style={styles.dateItem}>...ほかにもあるよ！</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button className="btn-action btn-primary" onClick={() => { setSelectedBadge(null); setIsPhotoMaximized(false); }} style={styles.closeBtn}>
              とじる
            </button>
          </div>
        </div>
      )}

      {/* 写真の拡大表示モーダル */}
      {isPhotoMaximized && selectedBadge && selectedBadge.image && (
        <div 
          style={styles.maximizedOverlay} 
          onClick={() => { audio.playClick(); setIsPhotoMaximized(false); }}
        >
          <div style={styles.maximizedContainer}>
            <img src={selectedBadge.image} alt={selectedBadge.name} style={styles.maximizedPhoto} />
            <div style={styles.maximizedTitle}>{selectedBadge.name}</div>
            <button 
              className="btn-action btn-primary" 
              onClick={() => { audio.playClick(); setIsPhotoMaximized(false); }}
              style={{ marginTop: '20px', padding: '10px 30px' }}
            >
              もどる
            </button>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginTop: '12px', letterSpacing: '0.05em' }}>
              （がめんの どこをタップしても もどれるよ）
            </p>
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
  testContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxHeight: '380px',
    overflowY: 'auto',
    padding: '10px',
    flex: 1,
    overscrollBehaviorY: 'contain'
  },
  blueprintCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '24px',
    padding: '16px 20px',
    width: '100%',
    textAlign: 'left'
  },
  blueprintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '8px'
  },
  blueprintGrade: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#fff',
    margin: 0
  },
  blueprintSub: {
    fontSize: '0.85rem',
    color: 'var(--color-text-sub)',
    margin: 0
  },
  currentProjectBox: {
    background: 'rgba(102, 252, 241, 0.03)',
    border: '1px solid rgba(102, 252, 241, 0.15)',
    borderRadius: '18px',
    padding: '12px 16px',
    marginBottom: '12px'
  },
  projectTitle: {
    fontSize: '1.0rem',
    fontWeight: '700',
    color: 'var(--color-primary)',
    marginBottom: '10px',
    textAlign: 'center',
    margin: '0 0 10px 0'
  },
  partsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '8px',
    flexWrap: 'wrap'
  },
  partSlot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 8px',
    borderRadius: '14px',
    width: '74px',
    transition: 'all 0.2s ease',
    textAlign: 'center'
  },
  partEmoji: {
    fontSize: '1.8rem',
    lineHeight: '1',
    marginBottom: '4px'
  },
  partName: {
    fontSize: '0.65rem',
    fontWeight: '700',
    lineHeight: '1.2'
  },
  completeSlotSpecial: {
    background: 'rgba(255, 183, 3, 0.06)',
    borderWidth: '2px',
    boxShadow: '0 0 10px rgba(255, 183, 3, 0.15)'
  },
  completedSection: {
    marginTop: '12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '10px'
  },
  completedSectionTitle: {
    fontSize: '0.8rem',
    color: 'var(--color-text-sub)',
    fontWeight: '700',
    marginBottom: '6px',
    margin: '0 0 6px 0'
  },
  completedList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  completedItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '4px 10px',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  completedEmoji: {
    fontSize: '1.2rem'
  },
  completedName: {
    fontSize: '0.75rem',
    color: '#fff',
    fontWeight: '700'
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
  },
  realPhotoContainer: {
    width: '180px',
    height: '180px',
    borderRadius: '24px',
    overflow: 'hidden',
    border: '4px solid var(--color-primary)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    marginBottom: '15px',
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    cursor: 'pointer'
  },
  realPhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  zoomHint: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'rgba(0, 0, 0, 0.6)',
    color: '#ffd166',
    fontSize: '0.75rem',
    padding: '4px 0',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  maximizedOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    cursor: 'pointer',
    animation: 'fadeIn 0.2s ease-out',
    overflowY: 'auto',
    padding: '40px 15px',
  },
  maximizedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '90%',
    width: '100%',
  },
  maximizedPhoto: {
    maxWidth: '100%',
    maxHeight: '60vh',
    borderRadius: '24px',
    border: '4px solid #fff',
    boxShadow: '0 0 30px rgba(255,255,255,0.2)',
    objectFit: 'contain',
  },
  maximizedTitle: {
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: 'bold',
    marginTop: '15px',
    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
  }
};
