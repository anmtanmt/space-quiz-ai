import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { storage } from '../utils/storage';
import { audio } from '../utils/audio';
import { useAuth } from '../contexts/AuthContext';
import LegalModal from './LegalModal';

export default function TitleScreen({ onStartQuiz, onViewCollection, onGoToParent }) {
  const { isPremium, planType, planExpiresAt } = useAuth();
  const [mode, setMode] = useState('ai'); // 'ai', 'parent', 'test', or 'spot_diff'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard' (or '4', '3' for test)
  const [hasParentQuizzes, setHasParentQuizzes] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(audio.enabled);

  // AI利用制限状態
  const [aiUsage, setAiUsage] = useState(() => storage.getAiUsage());
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lockTimerRef = useRef(null);
  const [countdownText, setCountdownText] = useState('');
  const [passCountdownText, setPassCountdownText] = useState('');

  // 30日間パスのリアルタイムカウントダウンタイマー
  useEffect(() => {
    if (!isPremium || planType !== 'pass_30d' || !planExpiresAt) return;

    const updatePassTimer = () => {
      const now = Date.now();
      const remainingMs = Math.max(0, planExpiresAt - now);
      if (remainingMs <= 0) {
        setPassCountdownText('期限切れ');
        return;
      }
      const totalSeconds = Math.floor(remainingMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => String(n).padStart(2, '0');
      
      if (days > 0) {
        setPassCountdownText(`あと${days}日 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      } else {
        setPassCountdownText(`あと ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
      }
    };

    updatePassTimer();
    const interval = setInterval(updatePassTimer, 1000);
    return () => clearInterval(interval);
  }, [isPremium, planType, planExpiresAt]);

  // エネルギー回復カウントダウンタイマー（ストップウォッチ形式で毎秒更新）
  useEffect(() => {
    if (!showLimitModal) return;

    const updateTimer = () => {
      const usage = storage.getAiUsage();
      setAiUsage(usage);
      if (usage.resetInMs <= 0) {
        setCountdownText('00:00:00');
        return;
      }
      const totalSeconds = Math.floor(usage.resetInMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      const pad = (n) => String(n).padStart(2, '0');
      setCountdownText(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateTimer();
    const timerId = setInterval(updateTimer, 1000);
    return () => clearInterval(timerId);
  }, [showLimitModal]);

  // 法務表記モーダル
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState('tokusho');

  const handleOpenLegal = (tab) => {
    audio.playClick();
    setLegalTab(tab);
    setShowLegalModal(true);
  };

  useEffect(() => {
    const parentQuizzes = storage.getParentQuizzes();
    setHasParentQuizzes(parentQuizzes.length > 0);
    // 最新のAI利用状況を取得
    setAiUsage(storage.getAiUsage());
    // BGMの起動待機（ユーザーの初回操作で再生されます）
    audio.startBgm();

    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
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

  const handleCloseLimitModal = () => {
    if (isTransitioning) return;
    audio.playClick();
    setIsTransitioning(true);
    setShowLimitModal(false);
    lockTimerRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  const handleGoToParentFromModal = () => {
    if (isTransitioning) return;
    audio.playClick();
    setShowLimitModal(false);
    onGoToParent();
  };

  const handleStart = () => {
    if (isTransitioning) return;
    audio.playClick();

    if (mode === 'parent' && !hasParentQuizzes) {
      alert('まだ「おとうさん・おかあさんの クイズ」が つくられていないよ！おとな用ページで クイズを つくってね。');
      return;
    }

    // 「おとうさん・おかあさんのクイズ」以外は、非課金だと全部あわせて1日2回まで
    if (mode !== 'parent' && !isPremium && !aiUsage.canPlay) {
      setShowLimitModal(true);
      return;
    }

    if (mode === 'spot_diff') {
      onStartQuiz('spot_diff', difficulty);
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
          <div style={styles.groupHeaderRow}>
            <h2 style={styles.groupTitle}>🧭 クイズの モードを えらぼう</h2>
            {/* 全体共通エネルギー表示 */}
            <div style={styles.globalEnergyBadge}>
              {isPremium ? (
                planType === 'pass_30d' ? (
                  <span style={styles.energyBadgePass}>
                    ⚡ あそびほうだい！ ({passCountdownText || 'のこり 30日'})
                  </span>
                ) : (
                  <span style={styles.energyBadgePremium}>⚡ 全モード あそびほうだい！</span>
                )
              ) : aiUsage.remaining === 2 ? (
                <span style={styles.energyBadgeFull}>⚡⚡ きょうのエネルギー: あと 2かい</span>
              ) : aiUsage.remaining === 1 ? (
                <span style={styles.energyBadgeHalf}>⚡⚪ きょうのエネルギー: あと 1かい</span>
              ) : (
                <span style={styles.energyBadgeEmpty}>⚪⚪ きょうのエネルギー: 0かい</span>
              )}
            </div>
          </div>

          <div className="options-row-mode" style={styles.optionsRow}>
            {/* 1. AIのひみつクイズ */}
            <button
              onClick={() => { audio.playClick(); setMode('ai'); }}
              style={{
                ...styles.optionCard,
                ...(mode === 'ai' ? styles.optionCardActive : {})
              }}
            >
              <div style={styles.cardIcon}>🤖</div>
              <div style={styles.cardTitle}>AIの<br />ひみつクイズ</div>
              <div style={styles.cardTicketTag}>⚡ エネルギーつかう</div>
              <div style={styles.cardDesc}>AIが 毎回（まいかい）新しく（あたらしく）つくるよ！</div>
            </button>

            {/* 2. おとうさん・おかあさんのクイズ（いつでもフリー） */}
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
              <div style={styles.cardFreeTag}>🎈 いつでも フリー！</div>
              <div style={styles.cardDesc}>
                {hasParentQuizzes 
                  ? 'おうちの人が つくってくれた クイズだよ！' 
                  : '（まだクイズが 登録（とうろく）されていません）'}
              </div>
            </button>

            {/* 3. 天文宇宙検定 */}
            <button
              onClick={() => { audio.playClick(); setMode('test'); }}
              style={{
                ...styles.optionCard,
                ...(mode === 'test' ? styles.optionCardActive : {})
              }}
            >
              <div style={styles.cardIcon}>🎓</div>
              <div style={styles.cardTitle}>てんもん<br />宇宙けんてい</div>
              <div style={styles.cardTicketTag}>⚡ エネルギーつかう</div>
              <div style={styles.cardDesc}>
                ほんかく的な 検定（けんてい）に チャレンジできるよ！
              </div>
            </button>

            {/* 4. 宇宙まちがいさがし */}
            <button
              onClick={() => { audio.playClick(); setMode('spot_diff'); }}
              style={{
                ...styles.optionCard,
                position: 'relative',
                ...(mode === 'spot_diff' ? styles.optionCardActive : {})
              }}
            >
              <div style={styles.betaBadge}>ベータ版</div>
              <div style={styles.cardIcon}>🔍</div>
              <div style={styles.cardTitle}>宇宙<br />まちがいさがし</div>
              <div style={styles.cardTicketTag}>⚡ エネルギーつかう</div>
              <div style={styles.cardDesc}>
                左右の 絵を 見くらべて、ちがうところを さがそう！
              </div>
            </button>
          </div>
        </div>

        {/* 難易度・級の選択 */}
        <div style={styles.group}>
          {mode === 'test' ? (
            <>
              <h2 style={styles.groupTitle}>⭐ チャレンジする きゅうを えらぼう</h2>
              <div className="options-row-diff" style={styles.optionsRow}>
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
              <div className="options-row-diff" style={styles.optionsRow}>
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

      {/* おとな用ページへのひっそりとしたボタン & 法務リンク */}
      <div style={styles.footer}>
        <button onClick={() => { audio.playClick(); onGoToParent(); }} style={styles.parentButton}>
          ⚙️ おとな用の ページ
        </button>
        <button onClick={() => handleOpenLegal('tokusho')} style={styles.legalFooterButton}>
          📜 利用規約・特定商取引法に基づく表記
        </button>
      </div>

      {/* 全ゲーム共通 上限（エネルギー切れ）モーダル */}
      {showLimitModal && ReactDOM.createPortal(
        <div style={styles.modalBackdrop} onClick={handleCloseLimitModal}>
          <div 
            style={styles.modalCard} 
            onClick={(e) => e.stopPropagation()}
            className="fade-in"
          >
            <div style={styles.modalIcon}>⚡</div>
            <h2 style={styles.modalTitle}>きょうの あそびエネルギーが<br />なくなったよ！</h2>

            <p style={styles.modalDesc}>
              「AIクイズ」「てんもん宇宙けんてい」「宇宙まちがいさがし」は、ぜんぶ あわせて 1にち <strong>2かい</strong> まで あそべるよ。<br />
              あしたになったら また パワーが ぜんかいふく するよ！🚀
            </p>

            {aiUsage.resetInMs > 0 && (
              <div style={styles.modalTimerBox}>
                ⏳ つぎの かいふくまで: <strong style={styles.modalStopwatchText}>{countdownText || '24:00:00'}</strong>
              </div>
            )}

            <div style={styles.modalNotice}>
              🎈 <strong>おとうさん・おかあさんの クイズ</strong> は、いつでも なんどでも 無料で あそべるよ！👨‍👩‍👧
            </div>

            <div style={styles.modalParentNotice}>
              🌟 <strong>【おうちのかたへ】</strong><br />
              「おとな用のページへ」から、月額380円の「宇宙博士プラン」にご加入いただくと、AIクイズ・天文宇宙検定・まちがいさがしなど全モードが無制限にあそび放題になります。
            </div>

            <div style={styles.modalActions}>
              <button 
                type="button" 
                className="btn-action btn-accent" 
                onClick={handleGoToParentFromModal}
                style={styles.modalParentBtn}
              >
                ⚙️ おとな用の ページへ ➔
              </button>
              <button 
                type="button" 
                className="btn-action" 
                onClick={handleCloseLimitModal}
                style={styles.modalCloseBtn}
              >
                ほかのクイズで あそぶ
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 法務表記モーダル */}
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        initialTab={legalTab}
      />
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
  groupHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  globalEnergyBadge: {
    display: 'flex',
    alignItems: 'center',
  },
  cardTicketTag: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: '#ffbe0b',
    background: 'rgba(255, 190, 11, 0.12)',
    border: '1px solid rgba(255, 190, 11, 0.3)',
    borderRadius: '8px',
    padding: '2px 6px',
    margin: '3px 0 5px 0',
    display: 'inline-block',
  },
  cardFreeTag: {
    fontSize: '0.7rem',
    fontWeight: 'bold',
    color: '#06d6a0',
    background: 'rgba(6, 214, 160, 0.12)',
    border: '1px solid rgba(6, 214, 160, 0.3)',
    borderRadius: '8px',
    padding: '2px 6px',
    margin: '3px 0 5px 0',
    display: 'inline-block',
  },
  groupTitle: {
    fontSize: '1.05rem',
    color: 'var(--color-text-sub)',
    textAlign: 'left',
    fontWeight: '700',
  },
  optionsRow: {
    display: 'flex',
    gap: '20px',
    width: '100%',
    flexWrap: 'wrap',
  },
  optionCard: {
    flex: '1 1 200px',
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
  betaBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'linear-gradient(135deg, #ff4d6d, #ef476f)',
    color: '#ffffff',
    fontSize: '0.65rem',
    fontWeight: '800',
    padding: '2px 8px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255, 77, 109, 0.5)',
    letterSpacing: '1px',
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
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  parentButton: {
    background: 'none',
    border: 'none',
    color: '#606580',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-family)',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'color 0.2s',
  },
  legalFooterButton: {
    background: 'none',
    border: 'none',
    color: '#555a73',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontFamily: 'var(--font-family)',
    padding: '6px 10px',
    textDecoration: 'underline',
    borderRadius: '8px',
    transition: 'color 0.2s',
  },
  // エネルギーバッジ用スタイル
  energyBadgePass: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, rgba(255, 94, 98, 0.25), rgba(255, 195, 113, 0.25))',
    color: '#ffc371',
    border: '1px solid rgba(255, 195, 113, 0.6)',
    padding: '3px 10px',
    borderRadius: '12px',
    margin: '4px 0 6px 0',
    display: 'inline-block',
    boxShadow: '0 0 10px rgba(255, 195, 113, 0.2)',
  },
  energyBadgePremium: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.25), rgba(255, 107, 107, 0.25))',
    color: '#ffd166',
    border: '1px solid rgba(255, 209, 102, 0.5)',
    padding: '3px 10px',
    borderRadius: '12px',
    margin: '4px 0 6px 0',
    display: 'inline-block',
  },
  energyBadgeFull: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    background: 'rgba(6, 214, 160, 0.15)',
    color: '#06d6a0',
    border: '1px solid rgba(6, 214, 160, 0.4)',
    padding: '3px 10px',
    borderRadius: '12px',
    margin: '4px 0 6px 0',
    display: 'inline-block',
  },
  energyBadgeHalf: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    background: 'rgba(255, 190, 11, 0.15)',
    color: '#ffbe0b',
    border: '1px solid rgba(255, 190, 11, 0.4)',
    padding: '3px 10px',
    borderRadius: '12px',
    margin: '4px 0 6px 0',
    display: 'inline-block',
  },
  energyBadgeEmpty: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.08)',
    color: '#8e96b8',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '3px 10px',
    borderRadius: '12px',
    margin: '4px 0 6px 0',
    display: 'inline-block',
  },
  // モーダル用スタイル
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(5, 7, 20, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modalCard: {
    background: '#13172e',
    border: '2px solid var(--color-primary)',
    borderRadius: '24px',
    padding: '28px 24px',
    maxWidth: '460px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(76, 201, 240, 0.2)',
    boxSizing: 'border-box',
  },
  modalIcon: {
    fontSize: '3.2rem',
    marginBottom: '8px',
  },
  modalTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: '1.4',
    marginBottom: '12px',
  },
  modalDesc: {
    fontSize: '0.95rem',
    color: '#c4c9e8',
    lineHeight: '1.6',
    marginBottom: '14px',
  },
  modalTimerBox: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 209, 102, 0.3)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.9rem',
    color: '#ffd166',
    marginBottom: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
  },
  modalStopwatchText: {
    fontFamily: '"SF Mono", "Roboto Mono", Menlo, Courier, monospace',
    fontSize: '1.25rem',
    letterSpacing: '0.08em',
    color: '#ffbe0b',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 190, 11, 0.25)',
  },
  modalNotice: {
    background: 'rgba(76, 201, 240, 0.08)',
    border: '1px solid rgba(76, 201, 240, 0.2)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#a0c4ff',
    marginBottom: '14px',
    lineHeight: '1.4',
    textAlign: 'left',
  },
  modalParentNotice: {
    background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.08), rgba(255, 107, 107, 0.08))',
    border: '1px solid rgba(255, 209, 102, 0.3)',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '0.85rem',
    color: '#ffbe0b',
    marginBottom: '20px',
    lineHeight: '1.5',
    textAlign: 'left',
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  modalParentBtn: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.05rem',
    fontWeight: 'bold',
    borderRadius: '14px',
    boxShadow: '0 4px 16px rgba(255, 107, 107, 0.4)',
    cursor: 'pointer',
  },
  modalCloseBtn: {
    width: '100%',
    padding: '10px 16px',
    fontSize: '0.9rem',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    color: '#a0a5c0',
    borderRadius: '12px',
    cursor: 'pointer',
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
