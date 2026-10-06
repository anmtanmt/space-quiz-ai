import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { SPACE_VIDEOS } from '../data/spaceVideos';
import { audio } from '../utils/audio';

export default function SpaceTheaterModal({ isOpen, onClose }) {
  const [activeVideo, setActiveVideo] = useState(SPACE_VIDEOS[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lockTimerRef = useRef(null);

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
    lockTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      onClose();
    }, 200);
  };

  const handleSelectVideo = (video) => {
    audio.playClick();
    setActiveVideo(video);
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

        {/* メインプレーヤー */}
        <div style={styles.playerContainer}>
          <div style={styles.iframeWrapper}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&autoplay=1&modestbranding=1`}
              title={activeVideo.title}
              style={styles.iframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div style={styles.videoMeta}>
            <div style={styles.videoMetaHeader}>
              <span style={{ ...styles.agencyBadge, backgroundColor: activeVideo.agencyColor }}>
                {activeVideo.agency} 公式
              </span>
              <h3 style={styles.activeVideoTitle}>{activeVideo.title}</h3>
            </div>
            <p style={styles.videoDesc}>{activeVideo.desc}</p>
          </div>
        </div>

        {/* 動画セレクター（一覧リスト） */}
        <div style={styles.playlistSection}>
          <h4 style={styles.playlistTitle}>📺 ほかの 動画を えらぶ：</h4>
          <div style={styles.playlistGrid}>
            {SPACE_VIDEOS.map((video) => {
              const isActive = video.id === activeVideo.id;
              return (
                <button
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  style={{
                    ...styles.videoCard,
                    ...(isActive ? styles.videoCardActive : {})
                  }}
                >
                  <div style={styles.cardThumbnailWrapper}>
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      style={styles.cardThumbnail}
                      loading="lazy"
                    />
                    <span style={{ ...styles.cardAgencyTag, backgroundColor: video.agencyColor }}>
                      {video.agency}
                    </span>
                    {isActive && <span style={styles.playingTag}>再生中 ▶</span>}
                  </div>
                  <div style={styles.cardTextWrap}>
                    <p style={styles.cardTitle}>{video.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 閉じるボタン */}
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
    maxWidth: '820px',
    maxHeight: '92vh',
    backgroundColor: '#0f172a',
    borderRadius: '24px',
    border: '2px solid rgba(102, 252, 241, 0.35)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(102, 252, 241, 0.2)',
    overflowY: 'auto',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
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
    fontSize: '1.45rem',
    fontWeight: '800',
    color: 'var(--color-primary, #66fcf1)',
    letterSpacing: '0.04em'
  },
  headerSub: {
    margin: '2px 0 0 0',
    fontSize: '0.88rem',
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
    alignItems: 'center',
    transition: 'background 0.2s'
  },
  playerContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.12)'
  },
  iframeWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%', // 16:9比率
    height: 0,
    backgroundColor: '#000'
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  },
  videoMeta: {
    padding: '16px',
    boxSizing: 'border-box'
  },
  videoMetaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '8px'
  },
  agencyBadge: {
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '0.78rem',
    fontWeight: '800',
    color: '#fff',
    letterSpacing: '0.05em'
  },
  activeVideoTitle: {
    margin: 0,
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#fff'
  },
  videoDesc: {
    margin: '6px 0 0 0',
    fontSize: '0.92rem',
    lineHeight: '1.6',
    color: '#cbd5e1'
  },
  playlistSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  playlistTitle: {
    margin: 0,
    fontSize: '0.98rem',
    fontWeight: '700',
    color: '#ffd166'
  },
  playlistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px'
  },
  videoCard: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '14px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
    textAlign: 'left',
    color: '#fff',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box'
  },
  videoCardActive: {
    background: 'rgba(102, 252, 241, 0.12)',
    borderColor: 'var(--color-primary, #66fcf1)',
    boxShadow: '0 0 16px rgba(102, 252, 241, 0.3)'
  },
  cardThumbnailWrapper: {
    position: 'relative',
    width: '100%',
    paddingBottom: '56.25%',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: '#000'
  },
  cardThumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  cardAgencyTag: {
    position: 'absolute',
    top: '6px',
    left: '6px',
    padding: '2px 7px',
    borderRadius: '8px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: '#fff'
  },
  playingTag: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    backgroundColor: 'rgba(239, 71, 111, 0.95)',
    padding: '2px 8px',
    borderRadius: '8px',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    color: '#fff'
  },
  cardTextWrap: {
    padding: '2px 4px'
  },
  cardTitle: {
    margin: 0,
    fontSize: '0.88rem',
    fontWeight: '700',
    lineHeight: '1.4',
    color: '#f8fafc',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '8px'
  },
  closeBtn: {
    padding: '12px 36px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '50px',
    cursor: 'pointer'
  }
};
