import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SPACE_VIDEOS } from '../data/spaceVideos';
import { audio } from '../utils/audio';

export default function SpaceTheaterModal({ isOpen, onClose }) {
  // 開いた直後は動画を自動再生しない（ユーザーがタップした時だけ再生）
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lockTimerRef = useRef(null);

  // モーダルが閉じた時、または開いた時に再生状態をリセット
  useEffect(() => {
    if (!isOpen) {
      setPlayingVideoId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    audio.playClick();
    setPlayingVideoId(null);
    lockTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      onClose();
    }, 200);
  };

  const handlePlayVideo = (videoId) => {
    audio.playClick();
    setPlayingVideoId(videoId);
  };

  const handleStopVideo = () => {
    audio.playClick();
    setPlayingVideoId(null);
  };

  return ReactDOM.createPortal(
    <div style={styles.backdrop} onClick={handleClose}>
      <div 
        style={styles.modal} 
        onClick={(e) => e.stopPropagation()} 
        className="scrollable-content fade-in"
      >
        {/* ヘッダー */}
        <div style={styles.header}>
          <div style={styles.headerTitleWrap}>
            <span style={styles.headerIcon}>🎬</span>
            <div>
              <h2 style={styles.headerTitle}>うちゅうシアター</h2>
              <p style={styles.headerSub}>JAXA・NASAの公式（こうしき）動画を 見てみよう！</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeIconBtn} aria-label="とじる">
            ✕
          </button>
        </div>

        {/* 縦スクロールの動画リスト */}
        <div style={styles.videoList}>
          {SPACE_VIDEOS.map((video) => {
            const isPlaying = playingVideoId === video.id;

            return (
              <div 
                key={video.id} 
                style={{
                  ...styles.videoCard,
                  ...(isPlaying ? styles.videoCardActive : {})
                }}
              >
                {/* 動画プレーヤー / サムネイル領域 */}
                <div style={styles.mediaContainer}>
                  {isPlaying ? (
                    <div style={styles.iframeWrapper}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                        title={video.title}
                        style={styles.iframe}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div 
                      style={styles.thumbnailWrapper}
                      onClick={() => handlePlayVideo(video.id)}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        style={styles.thumbnailImg}
                        loading="lazy"
                      />
                      <div style={styles.playOverlay}>
                        <div style={styles.playButtonCircle}>
                          ▶
                        </div>
                        <span style={styles.playButtonLabel}>動画をみる</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 動画情報・解説 */}
                <div style={styles.cardContent}>
                  <div style={styles.cardMetaRow}>
                    <span style={{ ...styles.agencyBadge, backgroundColor: video.agencyColor }}>
                      {video.agency} 公式
                    </span>
                    {isPlaying && (
                      <button 
                        type="button" 
                        onClick={handleStopVideo} 
                        style={styles.stopButton}
                      >
                        ⏹ 動画をとじる
                      </button>
                    )}
                  </div>
                  <h3 style={styles.cardTitle}>{video.title}</h3>
                  <p style={styles.cardDesc}>{video.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 下部閉じるボタン */}
        <div style={styles.bottomBar}>
          <button className="btn-action btn-primary" onClick={handleClose} style={styles.closeBtn}>
            クイズへ もどる
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(5, 8, 16, 0.88)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '16px',
    boxSizing: 'border-box'
  },
  modal: {
    width: '100%',
    maxWidth: '740px',
    maxHeight: '92vh',
    backgroundColor: '#0f172a',
    borderRadius: '24px',
    border: '2px solid rgba(102, 252, 241, 0.35)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(102, 252, 241, 0.15)',
    overflowY: 'auto',
    padding: '20px 24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    color: '#fff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '12px'
  },
  headerTitleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIcon: {
    fontSize: '2rem'
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--color-primary, #66fcf1)',
    letterSpacing: '0.04em'
  },
  headerSub: {
    margin: '2px 0 0 0',
    fontSize: '0.86rem',
    color: 'rgba(255, 255, 255, 0.65)'
  },
  closeIconBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingBottom: '8px'
  },
  videoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
  },
  videoCardActive: {
    borderColor: 'var(--color-primary, #66fcf1)',
    boxShadow: '0 0 24px rgba(102, 252, 241, 0.25)',
    backgroundColor: 'rgba(102, 252, 241, 0.04)'
  },
  mediaContainer: {
    width: '100%',
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  iframeWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9比率
    height: 0
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    cursor: 'pointer',
    backgroundColor: '#000'
  },
  thumbnailImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.88,
    transition: 'opacity 0.2s'
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)'
  },
  playButtonCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'rgba(239, 71, 111, 0.95)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.6rem',
    boxShadow: '0 4px 20px rgba(239, 71, 111, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.3)',
    paddingLeft: '4px' // 三角位置補正
  },
  playButtonLabel: {
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: '800',
    letterSpacing: '0.08em',
    textShadow: '0 2px 6px rgba(0, 0, 0, 0.8)',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '4px 12px',
    borderRadius: '12px'
  },
  cardContent: {
    padding: '16px 18px',
    boxSizing: 'border-box'
  },
  cardMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  agencyBadge: {
    padding: '3px 10px',
    borderRadius: '10px',
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.04em'
  },
  stopButton: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#ffbe0b',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    padding: '4px 12px',
    borderRadius: '14px',
    cursor: 'pointer'
  },
  cardTitle: {
    margin: '0 0 8px 0',
    fontSize: '1.18rem',
    fontWeight: '700',
    color: '#f8fafc',
    lineHeight: '1.4'
  },
  cardDesc: {
    margin: 0,
    fontSize: '0.92rem',
    lineHeight: '1.6',
    color: '#cbd5e1'
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '6px'
  },
  closeBtn: {
    padding: '12px 40px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '50px',
    cursor: 'pointer'
  }
};
