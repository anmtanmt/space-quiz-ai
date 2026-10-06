import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { audio } from '../utils/audio';

const NEWS_ITEMS = [
  {
    date: '2026.10.06',
    tag: 'NEW',
    tagColor: '#ef476f',
    title: '🎬 「うちゅうシアター」がオープンしました！',
    content: 'JAXAやNASAが公開している公式動画（H3ロケットの打ち上げ、はやぶさ2、ISSから見た青い地球など）を、アプリ内で安全に鑑賞できるようになりました！クイズと一緒に本物の宇宙映像を楽しもう！'
  },
  {
    date: '2026.10.06',
    tag: 'アップデート',
    tagColor: '#3a86ff',
    title: '🎓 天文宇宙検定（4級・3級）の探査機図鑑がさらに充実！',
    content: 'MMXローバー、アルテミスロケット、はやぶさ2、ハッブル望遠鏡など、組み立てパーツや完成機体の高画質写真とくわしい解説を追加しました。全8種類のプロジェクト完成を目指そう！'
  },
  {
    date: '2026.10.05',
    tag: 'X配信',
    tagColor: '#ffd166',
    title: '🐦 公式X（@space_quiz_ai）で毎朝クイズ配信中！',
    content: 'Twitter / Xにて、毎朝「天文宇宙検定4級」の対策クイズを定期配信しています。親子で毎日の宇宙チャレンジにぜひ挑戦してみてください！'
  },
  {
    date: '2026.09.25',
    tag: '新機能',
    tagColor: '#52b788',
    title: '🔍 「宇宙まちがいさがし」モードを追加！',
    content: '月や惑星、探査機の美しい写真を使った宇宙まちがいさがしゲームが遊べるようになりました。じっくり観察して違いを見つけよう！'
  },
  {
    date: '2026.09.20',
    tag: 'お知らせ',
    tagColor: '#a0a5c0',
    title: '🚀 「宇宙クイズ-AI」正式リリース',
    content: '未就学児（4歳〜）から小学生まで楽しく学べる宇宙知育Webアプリとしてスタートしました！'
  }
];

export default function NewsModal({ isOpen, onClose }) {
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
            <span style={styles.headerIcon}>📢</span>
            <div>
              <h2 style={styles.headerTitle}>おしらせ・更新情報</h2>
              <p style={styles.headerSub}>「宇宙クイズ-AI」の最新ニュースです</p>
            </div>
          </div>
          <button onClick={handleClose} style={styles.closeIconBtn} aria-label="とじる">
            ✕
          </button>
        </div>

        {/* 公式Xバナー */}
        <a 
          href="https://x.com/space_quiz_ai" 
          target="_blank" 
          rel="noopener noreferrer" 
          style={styles.xBanner}
          onClick={() => audio.playClick()}
        >
          <div style={styles.xBannerLeft}>
            <span style={styles.xLogo}>𝕏</span>
            <div>
              <p style={styles.xBannerTitle}>公式X（@space_quiz_ai）をフォロー！</p>
              <p style={styles.xBannerSub}>毎朝「天文宇宙検定4級クイズ」を好評配信中 🚀</p>
            </div>
          </div>
          <span style={styles.xBannerBtn}>見に行く ➔</span>
        </a>

        {/* タイムラインリスト */}
        <div style={styles.newsList}>
          {NEWS_ITEMS.map((item, index) => (
            <div key={index} style={styles.newsItem}>
              <div style={styles.itemHeader}>
                <span style={styles.itemDate}>{item.date}</span>
                <span style={{ 
                  ...styles.itemTag, 
                  backgroundColor: `${item.tagColor}22`,
                  color: item.tagColor,
                  border: `1px solid ${item.tagColor}55`
                }}>
                  {item.tag}
                </span>
              </div>
              <h3 style={styles.itemTitle}>{item.title}</h3>
              <p style={styles.itemContent}>{item.content}</p>
            </div>
          ))}
        </div>

        {/* 閉じるボタン */}
        <div style={styles.bottomBar}>
          <button className="btn-action btn-primary" onClick={handleClose} style={styles.closeBtn}>
            とじる
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
    maxWidth: '680px',
    maxHeight: '90vh',
    backgroundColor: '#0f172a',
    borderRadius: '24px',
    border: '2px solid rgba(255, 209, 102, 0.35)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 209, 102, 0.15)',
    overflowY: 'auto',
    padding: '24px',
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
    fontSize: '1.8rem'
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.35rem',
    fontWeight: '800',
    color: '#ffd166',
    letterSpacing: '0.04em'
  },
  headerSub: {
    margin: '2px 0 0 0',
    fontSize: '0.85rem',
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
  xBanner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '12px 16px',
    textDecoration: 'none',
    color: '#fff',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
  },
  xBannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  xLogo: {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  xBannerTitle: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#fff'
  },
  xBannerSub: {
    margin: '2px 0 0 0',
    fontSize: '0.78rem',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  xBannerBtn: {
    fontSize: '0.82rem',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    whiteSpace: 'nowrap'
  },
  newsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  newsItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '14px 16px',
    boxSizing: 'border-box'
  },
  itemHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px'
  },
  itemDate: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'monospace'
  },
  itemTag: {
    fontSize: '0.72rem',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '8px'
  },
  itemTitle: {
    margin: '0 0 6px 0',
    fontSize: '1rem',
    fontWeight: '700',
    color: '#f8fafc'
  },
  itemContent: {
    margin: 0,
    fontSize: '0.88rem',
    lineHeight: '1.6',
    color: '#cbd5e1'
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '6px'
  },
  closeBtn: {
    padding: '10px 36px',
    fontSize: '0.98rem',
    fontWeight: 'bold',
    borderRadius: '50px',
    cursor: 'pointer'
  }
};
