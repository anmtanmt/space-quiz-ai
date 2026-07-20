import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { audio } from '../utils/audio';
import { storage } from '../utils/storage';
import { generateGame, SpaceObject } from '../data/spotDifferenceData';
import { BADGE_POOL, getDynamicBadgeInfo, getBadgeBorderColor } from '../utils/badges';

export default function SpotDifferenceScreen({ difficulty, onBackToTitle, onViewCollection }) {
  // 全シーンIDの定義
  const ALL_SCENE_IDS = ['rocket_journey', 'alien_party', 'moon_sky', 'space_station', 'blackhole_comet', 'galaxy_drive'];
  const [currentSceneId, setCurrentSceneId] = useState('');
  const [clearCount, setClearCount] = useState(0); // クリアしたイラストの総数
  
  // ゲームデータ状態
  const [gameData, setGameData] = useState(null);
  const [foundIds, setFoundIds] = useState([]); // 発見した間違いIDのリスト
  const [particles, setParticles] = useState([]); // 飛び散る星パーティクル
  const [wrongClicks, setWrongClicks] = useState([]); // 不正解のタップ箇所
  const [lives, setLives] = useState(3); // ライフ (むずかしい専用)
  const [activeHintId, setActiveHintId] = useState(null); // 現在点滅表示しているヒント対象ID
  
  // 進行フェーズ
  const [phase, setPhase] = useState('READY'); // 'READY' (ステージ開始ボード), 'PLAYING', 'STAGE_CLEAR', 'GAME_OVER', 'ALL_CLEAR'
  const [isTransitioning, setIsTransitioning] = useState(false); // 誤タップ（突き抜け）ガード用ロックフラグ
  const [newBadge, setNewBadge] = useState(null);
  const [isNewBadgeEarned, setIsNewBadgeEarned] = useState(false);

  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const synthRef = useRef(null); // 音声発話インスタンス保持用

  // 1. 新しいシーンの初期化
  useEffect(() => {
    if (!currentSceneId) {
      // 初期起動時：ランダムに1番目のシーンをセット
      const firstId = ALL_SCENE_IDS[Math.floor(Math.random() * ALL_SCENE_IDS.length)];
      setCurrentSceneId(firstId);
      setLives(3);
      setClearCount(0);
      return;
    }

    const newGame = generateGame(currentSceneId, difficulty);
    setGameData(newGame);
    setFoundIds([]);
    setWrongClicks([]);
    setActiveHintId(null);
    setPhase('READY');
    
    // ステージ開始のアナウンス
    speakGuideText(newGame.name, difficulty);

    // 1.8秒後に自動でプレイ開始
    const timer = setTimeout(() => {
      setPhase('PLAYING');
    }, 1800);

    return () => clearTimeout(timer);
  }, [currentSceneId]);

  // 2. 音声読み上げガイド（5歳児向け）
  const speakGuideText = (sceneName, diff) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // 音声をリセット
    window.speechSynthesis.cancel();

    // 難易度ごとの間違い数
    let diffCount = 3;
    if (diff === 'medium') diffCount = 4;
    if (diff === 'hard') diffCount = 5;

    // 読み上げテキストの生成
    let text = '';
    const cleanSceneName = sceneName.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]*>/g, '');
    
    text = `${cleanSceneName}の まちがいさがし。まちがいは全部で ${diffCount}つ あるよ。左右の 絵を 見くらべて、ちがうところを タッチしてね。`;

    // 助詞「は」「へ」の誤読ハックと、一呼吸(ポーズ)のための読点ハック
    // 「は」が助詞の時に「わ」と読ませる簡易ハック
    let speechText = text
      .replace(/は/g, 'わ')
      .replace(/へ/g, 'え')
      .replace(/、/g, '。')
      .replace(/ /g, '。');

    // 特異ワードのアクセント補正
    speechText = speechText
      .replace(/宇宙飛行士/g, 'うちゅうひこうし')
      .replace(/宇宙人/g, 'うちゅうじん');

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'ja-JP';
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // 少し高めで優しい声

    // BGMのダッキング
    audio.duckBgm();

    utterance.onend = () => {
      audio.unduckBgm();
    };

    utterance.onerror = () => {
      audio.unduckBgm();
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // アンマウント時に音声読み上げをキャンセリング
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // 3. パーティクルの毎フレームアニメーションループ
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = requestAnimationFrame(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.18, // 重力で落下
            opacity: p.opacity - 0.025,
            scale: Math.max(0, p.scale - 0.015)
          }))
          .filter(p => p.opacity > 0)
      );
    });
    return () => cancelAnimationFrame(timer);
  }, [particles]);

  // 4. 不正解クリックのフェードアウト用エフェクトタイマー
  useEffect(() => {
    if (wrongClicks.length === 0) return;
    const timer = setTimeout(() => {
      setWrongClicks(prev => prev.slice(1));
    }, 600);
    return () => clearTimeout(timer);
  }, [wrongClicks]);

  // 5. 遷移時の誤タップ防止ロックタイマー
  const activateTransitionLock = (ms = 600) => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, ms);
    return () => clearTimeout(timer);
  };

  // 6. 星パーティクルの放出トリガー
  const triggerParticles = (pctX, pctY) => {
    const newParticles = [];
    const count = 15;
    const colors = ['#66fcf1', '#ffb703', '#ff4d6d', '#52b788', '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      const size = 12 + Math.random() * 14;
      const color = colors[Math.floor(Math.random() * colors.length)];
      newParticles.push({
        id: `${Date.now()}_${i}_${Math.random()}`,
        x: pctX, // パーセント座標で管理
        y: pctY,
        vx: Math.cos(angle) * speed * 0.15, // パーセント単位の速度にスケーリング
        vy: (Math.sin(angle) * speed - 1.5) * 0.15, 
        size,
        color,
        opacity: 1,
        scale: 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // 7. 左右どちらかのキャンバスのタップ・クリックハンドラー
  const handleCanvasClick = (e, side) => {
    // ロック中、または非プレイ中は無視
    if (isTransitioning || phase !== 'PLAYING') return;

    const rect = e.currentTarget.getBoundingClientRect();
    // 仮想サイズ 800x500 に対するパーセント割合座標
    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;

    // 仮想 800x500 基準の実ピクセル座標に変換
    const clickX = (pctX / 100) * 800;
    const clickY = (pctY / 100) * 500;

    // まだ見つかっていない間違いを検索
    let matchedDiff = null;
    let clickDistance = 9999;

    gameData.differences.forEach(diff => {
      if (foundIds.includes(diff.id)) return;

      // 距離を測定
      const dist = Math.sqrt((clickX - diff.x) ** 2 + (clickY - diff.y) ** 2);
      // 子供向けのルーズ判定 (本来の半径に 35px 判定枠をプラスする)
      const allowedRadius = (diff.size / 2) + 35;

      if (dist < allowedRadius) {
        if (dist < clickDistance) {
          clickDistance = dist;
          matchedDiff = diff;
        }
      }
    });

    if (matchedDiff) {
      // 正解処理
      audio.playCorrect();
      const updatedFound = [...foundIds, matchedDiff.id];
      setFoundIds(updatedFound);
      triggerParticles(pctX, pctY);
      
      // ヒント中のものを当てたらヒントを解除
      if (activeHintId === matchedDiff.id) {
        setActiveHintId(null);
      }

      // シーン内の全間違いを発見
      if (updatedFound.length === gameData.differences.length) {
        // 最後の丸をしっかりと確認してもらうため、1.8秒のディレイを設ける
        setTimeout(() => {
          handleStageClear();
        }, 1800);
      }
    } else {
      // 不正解処理
      audio.playWrong();
      
      // バウンドエフェクト用に位置を保存
      setWrongClicks(prev => [...prev, { id: Date.now(), x: pctX, y: pctY }]);

      // むずかしい難易度ならライフを削る
      if (difficulty === 'hard') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives === 0) {
          handleGameOver();
        }
      }
    }
  };

  // 8. ステージクリア処理
  const handleStageClear = () => {
    setPhase('ALL_CLEAR'); // 即座にごほうび獲得画面へ
    activateTransitionLock(1000);
    handleAllClear();
  };

  // 9. ゲームオーバー処理
  const handleGameOver = () => {
    setPhase('GAME_OVER');
    activateTransitionLock(1000);
  };

  // 10. オールクリア（バッジ獲得）
  const handleAllClear = () => {
    audio.playFanfare();
    const earned = storage.getEarnedBadges();
    const earnedIds = earned.map(b => b.id);
    
    // 通常バッジ（検定以外）を対象にする
    const unearned = BADGE_POOL.filter(b => !earnedIds.includes(b.id) && b.category !== 'test');

    let selected = null;
    let isNew = false;

    if (unearned.length > 0) {
      selected = unearned[Math.floor(Math.random() * unearned.length)];
      isNew = true;
    } else {
      const normalBadges = BADGE_POOL.filter(b => b.category !== 'test');
      selected = normalBadges[Math.floor(Math.random() * normalBadges.length)];
      isNew = false;
    }

    if (selected) {
      const result = storage.addEarnedBadge(selected.id, difficulty, 'spot_diff');
      const count = result ? result.count : 1;
      const dynamicBadge = getDynamicBadgeInfo(selected, count);

      setNewBadge({
        ...dynamicBadge,
        count: count,
        borderColor: getBadgeBorderColor({
          earnedDetails: [{ difficulty, mode: 'spot_diff' }]
        })
      });
      setIsNewBadgeEarned(isNew);
    }
  };

  // 10.5 次のステージへ進む（エンドレスランダム進行）
  const handleNextStage = () => {
    audio.playClick();
    
    // 前と同じシーンが連続しないようにランダム選出
    const candidates = ALL_SCENE_IDS.filter(id => id !== currentSceneId);
    const nextId = candidates[Math.floor(Math.random() * candidates.length)];
    
    setCurrentSceneId(nextId);
    setClearCount(prev => prev + 1);
    setNewBadge(null);
    setIsNewBadgeEarned(false);
    
    // むずかしい難易度なら、もしライフが尽きていたら回復（通常プレイ時は引き継ぎ）
    if (difficulty === 'hard' && lives <= 0) {
      setLives(3);
    }
  };

  // 11. ヒント機能
  const handleUseHint = () => {
    if (phase !== 'PLAYING' || isTransitioning) return;
    audio.playClick();

    // まだ見つかっていない間違いからランダムに1つ選定
    const unfound = gameData.differences.filter(d => !foundIds.includes(d.id));
    if (unfound.length === 0) return;

    const randomDiff = unfound[Math.floor(Math.random() * unfound.length)];
    setActiveHintId(randomDiff.id);

    // 3.5秒後にヒント点滅を自動オフにする
    setTimeout(() => {
      setActiveHintId(prev => prev === randomDiff.id ? null : prev);
    }, 3500);
  };

  // もう一度遊ぶ（最初からやり直す）
  const handleReplay = () => {
    audio.playClick();
    setFoundIds([]);
    setLives(3);
    setWrongClicks([]);
    setActiveHintId(null);
    setNewBadge(null);
    setIsNewBadgeEarned(false);
    setClearCount(0);
    
    // 新しいランダムなシーンへ
    const candidates = ALL_SCENE_IDS.filter(id => id !== currentSceneId);
    const nextId = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentSceneId(nextId);
  };

  if (!gameData) return null;

  return (
    <div className="spot-diff-screen scrollable-content" style={styles.container}>
      {/* 上部ヘッダーコントロール */}
      <div style={styles.header}>
        <button 
          onClick={() => { audio.playClick(); onBackToTitle(); }} 
          style={styles.backButton}
          className="btn-action"
        >
          ↩️ もどる
        </button>

        <div style={styles.titleArea}>
          <div style={styles.difficultyTag}>
            {difficulty === 'easy' && '🔰 やさしい'}
            {difficulty === 'medium' && '⭐ ふつう'}
            {difficulty === 'hard' && '🔥 むずかしい'}
          </div>
          <h2 style={styles.stageTitle}>
            まちがいさがし {clearCount + 1}つめ：<span dangerouslySetInnerHTML={{ __html: gameData.nameRuby }} />
          </h2>
        </div>

        {/* ライフインジケーター（むずかしいのみ） */}
        <div style={styles.infoArea}>
          {difficulty === 'hard' && (
            <div style={styles.livesRow}>
              {[...Array(3)].map((_, i) => (
                <span 
                  key={i} 
                  style={{
                    ...styles.heart,
                    opacity: i < lives ? 1 : 0.25,
                    transform: i < lives ? 'scale(1)' : 'scale(0.8)'
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ステージ開始前の準備ボード表示 */}
      {phase === 'READY' && (
        <div style={styles.readyBoard} className="scale-up-bounce">
          <h3 style={styles.readyText}>
            まちがいさがし {clearCount + 1}つめ<br />
            <span style={{ fontSize: '2.8rem', color: '#ffb703' }} dangerouslySetInnerHTML={{ __html: gameData.nameRuby }} />
          </h3>
          <p style={styles.readySubText}>
            まちがいは全部で <strong style={{ color: 'var(--color-primary)', fontSize: '2rem' }}>
              {difficulty === 'easy' ? '3つ' : difficulty === 'medium' ? '4つ' : '5つ'}
            </strong> あるよ！
          </p>
        </div>
      )}

      {/* メインの比較キャンバス領域 */}
      {phase !== 'READY' && (
        <div style={styles.gameBody}>
          {/* 左側：もとのえ */}
          <div 
            ref={leftCanvasRef}
            onClick={(e) => handleCanvasClick(e, 'left')}
            style={{ ...styles.canvas, backgroundColor: gameData.bg }}
            className="spot-diff-canvas"
          >
            <div style={styles.canvasLabel}>もとの え</div>
            {gameData.objects.map(obj => (
              <SpaceObject 
                key={obj.id} 
                type={obj.type} 
                size={obj.size} 
                x={obj.x} 
                y={obj.y} 
                angle={obj.angle} 
                properties={obj.properties} 
                isDiffMode={false} 
              />
            ))}

            {/* ヒントのハイライト表示（左画面） */}
            {activeHintId && (
              <div 
                style={{
                  ...styles.hintMarker,
                  left: `${(gameData.objects.find(o => o.id === activeHintId)?.x / 800) * 100}%`,
                  top: `${(gameData.objects.find(o => o.id === activeHintId)?.y / 500) * 100}%`,
                  width: `${((gameData.objects.find(o => o.id === activeHintId)?.size + 40) / 800) * 100}%`,
                }}
                className="hint-pulse"
              />
            )}

            {/* 発見した丸印 */}
            {foundIds.map(id => {
              const diffObj = gameData.differences.find(d => d.id === id);
              if (!diffObj) return null;
              return (
                <div
                  key={id}
                  style={{
                    ...styles.foundCircle,
                    left: `${(diffObj.x / 800) * 100}%`,
                    top: `${(diffObj.y / 500) * 100}%`,
                    width: `${((diffObj.size + 45) / 800) * 100}%`,
                  }}
                  className="found-circle-marker"
                />
              );
            })}

            {/* お手つきバツ印 */}
            {wrongClicks.map(click => (
              <div
                key={click.id}
                style={{
                  ...styles.wrongMarker,
                  left: `${click.x}%`,
                  top: `${click.y}%`
                }}
                className="wrong-click-marker"
              >
                ❌
              </div>
            ))}
          </div>

          {/* 右側：ちがうえ */}
          <div 
            ref={rightCanvasRef}
            onClick={(e) => handleCanvasClick(e, 'right')}
            style={{ ...styles.canvas, backgroundColor: gameData.bg }}
            className="spot-diff-canvas"
          >
            <div style={styles.canvasLabel}>ちがう え</div>
            {gameData.objects.map(obj => (
              <SpaceObject 
                key={obj.id} 
                type={obj.type} 
                size={obj.size} 
                x={obj.x} 
                y={obj.y} 
                angle={obj.angle} 
                properties={obj.properties} 
                isDiffMode={true} 
              />
            ))}

            {/* ヒントのハイライト表示（右画面） */}
            {activeHintId && (
              <div 
                style={{
                  ...styles.hintMarker,
                  left: `${(gameData.objects.find(o => o.id === activeHintId)?.x / 800) * 100}%`,
                  top: `${(gameData.objects.find(o => o.id === activeHintId)?.y / 500) * 100}%`,
                  width: `${((gameData.objects.find(o => o.id === activeHintId)?.size + 40) / 800) * 100}%`,
                }}
                className="hint-pulse"
              />
            )}

            {/* 発見した丸印 */}
            {foundIds.map(id => {
              const diffObj = gameData.differences.find(d => d.id === id);
              if (!diffObj) return null;
              return (
                <div
                  key={id}
                  style={{
                    ...styles.foundCircle,
                    left: `${(diffObj.x / 800) * 100}%`,
                    top: `${(diffObj.y / 500) * 100}%`,
                    width: `${((diffObj.size + 45) / 800) * 100}%`,
                  }}
                  className="found-circle-marker"
                />
              );
            })}

            {/* お手つきバツ印 */}
            {wrongClicks.map(click => (
              <div
                key={click.id}
                style={{
                  ...styles.wrongMarker,
                  left: `${click.x}%`,
                  top: `${click.y}%`
                }}
                className="wrong-click-marker"
              >
                ❌
              </div>
            ))}
          </div>

          {/* 飛び散る星のパーティクルエフェクトレイヤー */}
          <div style={styles.particlesContainer}>
            {particles.map(p => (
              <div
                key={p.id}
                style={{
                  ...styles.particleStar,
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  color: p.color,
                  opacity: p.opacity,
                  transform: `translate(-50%, -50%) scale(${p.scale})`
                }}
              >
                ✦
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ゲームオーバー画面 */}
      {phase === 'GAME_OVER' && ReactDOM.createPortal(
        <div style={styles.backdrop}>
          <div style={styles.overlayBoard} className="fade-in">
            <div style={styles.hugeEmoji}>🛸</div>
            <h3 style={{ fontSize: '2.5rem', color: 'var(--color-wrong)', fontWeight: '800' }}>
              ざんねん！
            </h3>
            <p style={{ fontSize: '1.2rem', margin: '15px 0' }}>ライフが なくなっちゃった！</p>
            <div style={styles.actionButtons}>
              <button className="btn-action btn-accent" onClick={handleReplay} style={styles.modalBtn}>
                🔄 もういちど チャレンジ
              </button>
              <button className="btn-action btn-back" onClick={onBackToTitle} style={styles.modalBtn}>
                🏠 タイトルへ もどる
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ステージクリア（バッジ獲得）画面 */}
      {phase === 'ALL_CLEAR' && ReactDOM.createPortal(
        <div style={styles.backdrop}>
          <div style={styles.overlayBoard} className="scale-up-bounce">
            <div style={styles.medalIcon}>🎉</div>
            <h3 style={{ fontSize: '2.6rem', color: '#ffb703', fontWeight: '800', textShadow: '0 0 20px rgba(255,183,3,0.5)' }}>
              せいかい！
            </h3>
            <p style={{ fontSize: '1.25rem', margin: '8px 0 18px 0', lineHeight: '1.4' }}>
              すべての まちがいを みつけたぞ！<br />
              きみは <strong>うちゅうの めいたんてい</strong> だ！🔍
            </p>

            {newBadge && (
              <div 
                style={{
                  ...styles.badgeRewardBox,
                  borderColor: newBadge.borderColor || '#ffb703',
                  background: 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <div 
                  style={{
                    ...styles.rewardBadgeGraphic,
                    backgroundColor: newBadge.color || '#ffb703',
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '2.5rem',
                    border: '3px solid #ffffff',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    flexShrink: 0
                  }}
                >
                  {newBadge.emoji}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ color: '#ffb703', fontSize: '1.2rem', fontWeight: '700' }}>
                    {isNewBadgeEarned ? '🎉 はじめて ゲット！' : '⭐ ２回目（かいめ）以降（いこう）のごほうび！'}
                  </h4>
                  <p style={{ fontSize: '1.1rem', color: '#ffffff', fontWeight: '700', marginTop: '2px' }}>
                    {newBadge.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#a0a5c0', marginTop: '4px', lineHeight: '1.4' }}>
                    {newBadge.desc}
                  </p>
                </div>
              </div>
            )}

            <div style={styles.actionButtons}>
              <button className="btn-action btn-accent" onClick={handleNextStage} style={styles.modalBtn}>
                🚀 つぎの まちがいさがしへ！
              </button>
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button className="btn-action btn-secondary" onClick={onViewCollection} style={{ ...styles.modalBtn, flex: 1 }}>
                  🏆 コレクション
                </button>
                <button className="btn-action btn-back" onClick={onBackToTitle} style={{ ...styles.modalBtn, flex: 1 }}>
                  🏠 おわる
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 下部操作ナビゲーション */}
      {phase !== 'READY' && (
        <div style={styles.footerControls}>
          {/* 星インジケーター */}
          <div style={styles.progressBox}>
            <span style={styles.indicatorText}>みつけた数：</span>
            <div style={styles.starsRow}>
              {gameData.differences.map((diff, i) => (
                <span 
                  key={diff.id} 
                  style={{
                    ...styles.progressStar,
                    color: i < foundIds.length ? '#ffb703' : 'rgba(255, 255, 255, 0.15)',
                    animation: i < foundIds.length ? 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' : 'none'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* ヒントボタン */}
          <button 
            onClick={handleUseHint} 
            disabled={activeHintId !== null || phase !== 'PLAYING'}
            style={{
              ...styles.hintButton,
              opacity: (activeHintId !== null || phase !== 'PLAYING') ? 0.5 : 1,
              cursor: (activeHintId !== null || phase !== 'PLAYING') ? 'not-allowed' : 'pointer'
            }}
            className="btn-action btn-accent"
          >
            💡 おたすけヒント
          </button>
        </div>
      )}
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
    padding: '20px 30px',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  backButton: {
    padding: '8px 16px',
    fontSize: '1rem',
    borderRadius: '12px'
  },
  titleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  difficultyTag: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '12px',
    padding: '4px 10px',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  stageTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#ffffff'
  },
  infoArea: {
    minWidth: '100px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  livesRow: {
    display: 'flex',
    gap: '8px'
  },
  heart: {
    fontSize: '1.6rem',
    transition: 'all 0.3s ease-out'
  },
  readyBoard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
    background: 'var(--color-card-bg)',
    border: '2px solid var(--color-card-border)',
    borderRadius: '32px',
    padding: '40px 60px',
    textAlign: 'center',
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    width: '95%',
    maxWidth: '650px',
    backdropFilter: 'blur(12px)'
  },
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(5, 5, 15, 0.65)',
    backdropFilter: 'blur(10px)',
    zIndex: 9999
  },
  overlayBoard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(10, 10, 25, 0.92)',
    border: '2.5px solid var(--color-card-border)',
    borderRadius: '32px',
    padding: '30px 48px',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
    width: '90%',
    maxWidth: '520px',
    minHeight: '340px'
  },
  readyText: {
    fontSize: '1.4rem',
    color: '#a0a5c0',
    lineHeight: '1.6',
    fontWeight: '700'
  },
  readySubText: {
    marginTop: '15px',
    fontSize: '1.1rem',
    color: '#ffffff'
  },
  hugeEmoji: {
    fontSize: '4.0rem',
    marginBottom: '12px',
    animation: 'rocketFloat 3s ease-in-out infinite alternate',
    flexShrink: 0
  },
  gameBody: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    gap: '20px',
    margin: '10px 0'
  },
  canvas: {
    position: 'relative',
    width: '48.5%',
    aspectRatio: '800 / 500',
    border: '3px solid var(--color-card-border)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45)',
    cursor: 'pointer'
  },
  canvasLabel: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '700',
    zIndex: 10,
    pointerEvents: 'none'
  },
  wrongMarker: {
    position: 'absolute',
    fontSize: '2.5rem',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 20
  },
  foundCircle: {
    position: 'absolute',
    aspectRatio: '1 / 1',
    border: '4px solid #ef476f',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    boxShadow: '0 0 0 3px #ffffff, 0 0 15px #ef476f, inset 0 0 15px #ef476f',
    zIndex: 15
  },
  hintMarker: {
    position: 'absolute',
    aspectRatio: '1 / 1',
    border: '4px dashed #ffb703',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 12
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 25
  },
  particleStar: {
    position: 'absolute',
    fontSize: '1.5rem',
    pointerEvents: 'none'
  },
  footerControls: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px'
  },
  progressBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.06)',
    padding: '10px 20px',
    borderRadius: '16px',
    border: '1px solid var(--color-card-border)'
  },
  indicatorText: {
    fontSize: '1rem',
    color: '#a0a5c0',
    fontWeight: '700'
  },
  starsRow: {
    display: 'flex',
    gap: '6px'
  },
  progressStar: {
    fontSize: '1.6rem',
    lineHeight: 1
  },
  hintButton: {
    padding: '12px 24px',
    fontSize: '1.1rem',
    borderRadius: '16px'
  },
  modalBtn: {
    width: '100%',
    padding: '14px 20px',
    fontSize: '1.15rem',
    borderRadius: '16px',
    flexShrink: 0
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    minWidth: '250px'
  },
  medalIcon: {
    fontSize: '4.8rem',
    marginBottom: '8px',
    animation: 'rocketFloat 3s ease-in-out infinite alternate',
    flexShrink: 0
  },
  badgeRewardBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    background: 'rgba(255,183,3,0.1)',
    border: '2px solid #ffb703',
    borderRadius: '20px',
    padding: '14px 22px',
    marginBottom: '18px',
    width: '100%'
  },
  rewardBadgeGraphic: {
    fontSize: '2.8rem',
    lineHeight: 1
  }
};
