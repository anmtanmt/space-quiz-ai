import React from 'react';

// ==========================================
// 1. ポップな宇宙パーツのSVGコンポーネント群
//    レスポンシブ化のため、width/heightは100%にし、viewBoxでサイズ制御
// ==========================================

// 星 (きらきら星)
export function SVGStar({ color = '#ffb703', angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 50 50" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      <polygon
        points="25,2 32,18 49,18 35,28 40,45 25,35 10,45 15,28 1,18 18,18"
        fill={color}
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// 笑顔の月
export function SVGMoon({ isSmile = true, hasHat = true, craterCount = 3, color = '#ffd166' }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
      {/* 月の本体 */}
      <circle cx="50" cy="50" r="45" fill={color} stroke="#ffffff" strokeWidth="3" />
      
      {/* クレーター */}
      {craterCount > 0 && <circle cx="30" cy="35" r="7" fill="rgba(0,0,0,0.08)" />}
      {craterCount > 1 && <circle cx="40" cy="72" r="5" fill="rgba(0,0,0,0.08)" />}
      {craterCount > 2 && <circle cx="70" cy="30" r="8" fill="rgba(0,0,0,0.08)" />}
      {craterCount > 3 && <circle cx="75" cy="65" r="6" fill="rgba(0,0,0,0.08)" />}

      {/* 目 */}
      <circle cx="40" cy="45" r="4" fill="#1b1b3a" />
      <circle cx="65" cy="45" r="4" fill="#1b1b3a" />

      {/* 口 (笑顔 or 驚き) */}
      {isSmile ? (
        <path d="M 45 55 Q 52 65 60 55" fill="none" stroke="#1b1b3a" strokeWidth="4" strokeLinecap="round" />
      ) : (
        <circle cx="52" cy="58" r="6" fill="none" stroke="#1b1b3a" strokeWidth="4" />
      )}

      {/* ほっぺ */}
      <circle cx="34" cy="52" r="4" fill="#ff85a1" opacity="0.6" />
      <circle cx="71" cy="52" r="4" fill="#ff85a1" opacity="0.6" />

      {/* とんがり帽子 */}
      {hasHat && (
        <g transform="translate(40, -10) rotate(15)">
          <polygon points="10,25 0,0 -10,25" fill="#ef476f" stroke="#ffffff" strokeWidth="2" />
          <circle cx="0" cy="0" r="4" fill="#ffd166" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

// ロケット
export function SVGRocket({ color = '#ef476f', windowCount = 2, hasFire = true, wingColor = '#118ab2', angle = 45 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* 炎の噴射 */}
      {hasFire && (
        <g transform="translate(60, 100)">
          <path d="M -15 0 C -25 25, 0 45, 0 45 C 0 45, 25 25, 15 0 Z" fill="#ffd166" />
          <path d="M -8 0 C -15 15, 0 30, 0 30 C 0 30, 15 15, 8 0 Z" fill="#ff8500" />
        </g>
      )}
      
      {/* ロケットブースターの足 */}
      <path d="M 30 75 L 15 95 L 35 95 Z" fill={wingColor} stroke="#ffffff" strokeWidth="2.5" />
      <path d="M 90 75 L 105 95 L 85 95 Z" fill={wingColor} stroke="#ffffff" strokeWidth="2.5" />

      {/* ロケット本体 */}
      <rect x="35" y="30" width="50" height="60" rx="25" fill="#f8f9fa" stroke="#ffffff" strokeWidth="3" />
      
      {/* 先端コックピットカバー */}
      <path d="M 35 45 C 35 15, 85 15, 85 45 Z" fill={color} stroke="#ffffff" strokeWidth="3" />

      {/* 窓 */}
      {windowCount > 0 && (
        <circle cx="60" cy="50" r="8" fill="#e0fbfc" stroke="#1b1b3a" strokeWidth="2.5" />
      )}
      {windowCount > 1 && (
        <circle cx="60" cy="72" r="8" fill="#e0fbfc" stroke="#1b1b3a" strokeWidth="2.5" />
      )}
      {windowCount > 2 && (
        <circle cx="60" cy="94" r="6" fill="#e0fbfc" stroke="#1b1b3a" strokeWidth="2.5" />
      )}
    </svg>
  );
}

// UFO
export function SVGUfo({ color = '#06d6a0', lightColor = '#ffd166', hasAntenna = true, hasAlienInside = true, angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 110 110" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* アンテナ */}
      {hasAntenna && (
        <g transform="translate(55, 30)">
          <line x1="0" y1="0" x2="0" y2="-20" stroke="#ffffff" strokeWidth="3.5" />
          <circle cx="0" cy="-22" r="6" fill="#ef476f" stroke="#ffffff" strokeWidth="2" />
        </g>
      )}

      {/* キャノピー */}
      <path d="M 30 55 C 30 20, 80 20, 80 55 Z" fill="rgba(224, 251, 252, 0.6)" stroke="#ffffff" strokeWidth="2.5" />

      {/* ガラスの中の宇宙人 */}
      {hasAlienInside && (
        <g transform="translate(55, 48) scale(0.6)">
          <circle cx="0" cy="0" r="15" fill="#ffd166" />
          <circle cx="-5" cy="-2" r="3" fill="#000" />
          <circle cx="5" cy="-2" r="3" fill="#000" />
          <path d="M -6 5 Q 0 10 6 5" fill="none" stroke="#000" strokeWidth="2" />
          {/* 小さな触覚 */}
          <line x1="0" y1="-15" x2="0" y2="-22" stroke="#ffd166" strokeWidth="3" />
          <circle cx="0" cy="-23" r="3" fill="#ef476f" />
        </g>
      )}

      {/* UFOソーサー本体 */}
      <ellipse cx="55" cy="65" rx="45" ry="15" fill={color} stroke="#ffffff" strokeWidth="3" />

      {/* ドーム下部のライト */}
      <circle cx="28" cy="65" r="4.5" fill={lightColor} stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="41" cy="69" r="4.5" fill={lightColor} stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="55" cy="70" r="4.5" fill={lightColor} stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="69" cy="69" r="4.5" fill={lightColor} stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="82" cy="65" r="4.5" fill={lightColor} stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

// 宇宙飛行士
export function SVGAstronaut({ visorColor = '#118ab2', hasFlag = true, flagColor = '#ffb703', angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 110 110" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* ライフサポートパック */}
      <rect x="20" y="35" width="22" height="45" rx="5" fill="#cccccc" stroke="#ffffff" strokeWidth="2" />

      {/* 手（左手：旗を持つ） */}
      {hasFlag && (
        <g>
          {/* 旗の棒 */}
          <line x1="25" y1="60" x2="10" y2="20" stroke="#ffffff" strokeWidth="3" />
          {/* 旗 */}
          <polygon points="10,20 10,38 32,29" fill={flagColor} stroke="#ffffff" strokeWidth="2" />
          {/* 旗のマーク */}
          <polygon points="17,27 19,31 23,31 20,33 21,37 17,35 13,37 14,33 11,31 15,31" fill="#ffffff" transform="scale(0.8) translate(3, 2)" />
        </g>
      )}
      
      {/* 左腕 */}
      <path d="M 40 50 Q 25 55 25 62" fill="none" stroke="#f8f9fa" strokeWidth="12" strokeLinecap="round" />
      <path d="M 40 50 Q 25 55 25 62" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />

      {/* 足 */}
      <rect x="42" y="75" width="12" height="20" rx="4" fill="#ffffff" stroke="#cccccc" strokeWidth="2.5" />
      <rect x="62" y="75" width="12" height="20" rx="4" fill="#ffffff" stroke="#cccccc" strokeWidth="2.5" />

      {/* 体 */}
      <rect x="38" y="45" width="40" height="35" rx="10" fill="#ffffff" stroke="#cccccc" strokeWidth="3" />
      <rect x="46" y="55" width="24" height="8" rx="2" fill="#ef476f" />

      {/* 右腕 */}
      <path d="M 75 50 Q 90 55 90 62" fill="none" stroke="#f8f9fa" strokeWidth="12" strokeLinecap="round" />
      <path d="M 75 50 Q 90 55 90 62" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />

      {/* 頭 */}
      <circle cx="58" cy="32" r="22" fill="#ffffff" stroke="#cccccc" strokeWidth="3" />
      
      {/* バイザー */}
      <rect x="43" y="20" width="30" height="18" rx="9" fill={visorColor} stroke="#ffffff" strokeWidth="2" />
      {/* 反射光 */}
      <ellipse cx="65" cy="24" rx="4" ry="2" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

// たこ型宇宙人
export function SVGAlien({ color = '#ffd166', eyeCount = 3, legCount = 4, angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* 触角 */}
      <path d="M 50 35 Q 50 15 62 10" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="62" cy="10" r="6" fill="#ef476f" stroke="#ffffff" strokeWidth="2" />

      {/* 足 */}
      {legCount > 3 && <path d="M 30 75 Q 20 95 15 90" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />}
      <path d="M 40 75 Q 40 95 38 95" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      <path d="M 60 75 Q 60 95 62 95" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
      {legCount > 2 && <path d="M 70 75 Q 80 95 85 90" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />}

      {/* 体 */}
      <circle cx="50" cy="50" r="28" fill={color} stroke="#ffffff" strokeWidth="3" />

      {/* 目 */}
      {eyeCount === 1 && (
        <g transform="translate(50, 42)">
          <circle cx="0" cy="0" r="9" fill="#ffffff" stroke="#1b1b3a" strokeWidth="2" />
          <circle cx="0" cy="0" r="4.5" fill="#ef476f" />
          <circle cx="-2" cy="-2" r="1.5" fill="#ffffff" />
        </g>
      )}

      {eyeCount === 2 && (
        <g transform="translate(50, 42)">
          <circle cx="-10" cy="0" r="7" fill="#ffffff" stroke="#1b1b3a" strokeWidth="2" />
          <circle cx="-10" cy="0" r="3.5" fill="#00bbf9" />
          <circle cx="10" cy="0" r="7" fill="#ffffff" stroke="#1b1b3a" strokeWidth="2" />
          <circle cx="10" cy="0" r="3.5" fill="#00bbf9" />
        </g>
      )}

      {eyeCount === 3 && (
        <g transform="translate(50, 42)">
          <circle cx="-13" cy="3" r="6" fill="#ffffff" stroke="#1b1b3a" strokeWidth="2" />
          <circle cx="-13" cy="3" r="3" fill="#00f5d4" />
          <circle cx="0" cy="-6" r="7" fill="#ffffff" stroke="#1b1b3a" strokeWidth="2" />
          <circle cx="0" cy="-6" r="3.5" fill="#00f5d4" />
          <circle cx="13" cy="3" r="6" fill="#ffffff" stroke="#1b1b3a" strokeWidth="2" />
          <circle cx="13" cy="3" r="3" fill="#00f5d4" />
        </g>
      )}

      {/* 口 */}
      <path d="M 44 64 Q 50 72 56 64" fill="none" stroke="#1b1b3a" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// 惑星
export function SVGPlanet({ planetType = 'saturn', hasRing = true, color = '#118ab2', ringColor = '#ffd166', angle = -15 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 110 110" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* 土星の奥側の輪 */}
      {planetType === 'saturn' && hasRing && (
        <path d="M 10 55 C 10 38, 100 38, 100 55" fill="none" stroke={ringColor} strokeWidth="12" strokeLinecap="round" opacity="0.9" />
      )}

      {/* 惑星本体 */}
      <circle cx="55" cy="55" r="32" fill={color} stroke="#ffffff" strokeWidth="3" />

      {/* 惑星ごとのデコレーション */}
      {planetType === 'earth' && (
        <g>
          <path d="M 38 40 Q 42 30 52 35 T 58 48 T 46 55 Z" fill="#06d6a0" clipPath="url(#planet-clip)" />
          <path d="M 60 60 Q 72 55 78 72 T 62 82 T 52 68 Z" fill="#06d6a0" clipPath="url(#planet-clip)" />
          <clipPath id="planet-clip">
            <circle cx="55" cy="55" r="30.5" />
          </clipPath>
        </g>
      )}

      {planetType === 'mars' && (
        <g>
          <circle cx="45" cy="40" r="5" fill="rgba(0,0,0,0.12)" />
          <circle cx="68" cy="70" r="7" fill="rgba(0,0,0,0.12)" />
          <circle cx="72" cy="45" r="4.5" fill="rgba(0,0,0,0.12)" />
        </g>
      )}

      {planetType === 'saturn' && (
        <g>
          <line x1="24" y1="48" x2="86" y2="48" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
          <line x1="24" y1="62" x2="86" y2="62" stroke="rgba(0,0,0,0.08)" strokeWidth="4" />
        </g>
      )}

      {/* 土星の手前側の輪 */}
      {planetType === 'saturn' && hasRing && (
        <path d="M 10 55 C 10 72, 100 72, 100 55" fill="none" stroke={ringColor} strokeWidth="12" strokeLinecap="round" />
      )}
    </svg>
  );
}

// 人工衛星
export function SVGSatellite({ hasDoublePanel = true, hasSignal = true, angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* 電波マーク */}
      {hasSignal && (
        <g stroke="#66fcf1" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M 30 70 A 15 15 0 0 0 30 90" opacity="0.4" />
          <path d="M 23 63 A 25 25 0 0 0 23 97" opacity="0.7" />
          <path d="M 16 56 A 35 35 0 0 0 16 104" opacity="1.0" />
        </g>
      )}

      {/* 太陽電池パネル（左） */}
      <rect x="5" y="42" width="28" height="16" rx="2" fill="#118ab2" stroke="#ffffff" strokeWidth="2" />
      <line x1="5" y1="50" x2="33" y2="50" stroke="#ffffff" strokeWidth="1" />
      <line x1="14" y1="42" x2="14" y2="58" stroke="#ffffff" strokeWidth="1" />
      <line x1="24" y1="42" x2="24" y2="58" stroke="#ffffff" strokeWidth="1" />
      <line x1="33" y1="50" x2="42" y2="50" stroke="#ffffff" strokeWidth="3.5" />

      {/* 太陽電池パネル（右） */}
      {hasDoublePanel && (
        <g>
          <rect x="67" y="42" width="28" height="16" rx="2" fill="#118ab2" stroke="#ffffff" strokeWidth="2" />
          <line x1="67" y1="50" x2="95" y2="50" stroke="#ffffff" strokeWidth="1" />
          <line x1="76" y1="42" x2="76" y2="58" stroke="#ffffff" strokeWidth="1" />
          <line x1="86" y1="42" x2="86" y2="58" stroke="#ffffff" strokeWidth="1" />
          <line x1="58" y1="50" x2="67" y2="50" stroke="#ffffff" strokeWidth="3.5" />
        </g>
      )}

      {/* 人工衛星本体 */}
      <rect x="40" y="35" width="20" height="30" rx="4" fill="#e0fbfc" stroke="#ffffff" strokeWidth="2.5" />
      
      {/* アンテナパラボラ */}
      <path d="M 40 35 Q 50 25 60 35 Z" fill="#ef476f" stroke="#ffffff" strokeWidth="2" />
      <line x1="50" y1="30" x2="50" y2="20" stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="50" cy="18" r="3.5" fill="#ffd166" />
    </svg>
  );
}

// おそうじロボット
export function SVGRobot({ color = '#118ab2', hasAntenna = true, eyeCount = 2, bodyColor = '#f8f9fa', angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* アンテナ */}
      {hasAntenna && (
        <g transform="translate(50, 20)">
          <line x1="0" y1="0" x2="0" y2="-15" stroke="#ffffff" strokeWidth="3" />
          <circle cx="0" cy="-17" r="4.5" fill="#ef476f" stroke="#ffffff" strokeWidth="1.5" />
        </g>
      )}
      
      {/* 腕 */}
      <path d="M 24 55 Q 12 55 16 68" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 76 55 Q 88 55 84 68" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" />

      {/* 胴体 */}
      <rect x="24" y="30" width="52" height="42" rx="12" fill={bodyColor} stroke="#cccccc" strokeWidth="3" />
      
      {/* お腹のスクリーン */}
      <rect x="34" y="48" width="32" height="16" rx="4" fill={color} stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="50" cy="56" r="3" fill="#ffffff" opacity="0.8" />

      {/* 目 */}
      {eyeCount === 2 ? (
        <g>
          <circle cx="40" cy="40" r="5.5" fill="#1b1b3a" />
          <circle cx="38" cy="38" r="1.5" fill="#ffffff" />
          <circle cx="60" cy="40" r="5.5" fill="#1b1b3a" />
          <circle cx="58" cy="38" r="1.5" fill="#ffffff" />
        </g>
      ) : (
        <g>
          <circle cx="50" cy="40" r="7.5" fill="#ef476f" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="48" cy="38" r="2" fill="#ffffff" />
        </g>
      )}

      {/* タイヤ */}
      <ellipse cx="50" cy="76" rx="16" ry="6" fill="#1b1b3a" stroke="#ffffff" strokeWidth="2" />
    </svg>
  );
}

// ほうき星 (彗星)
export function SVGComet({ color = '#00bbf9', tailColor = 'rgba(0,187,249,0.3)', tailCount = 2, angle = -45 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 80" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* ほうき星の尾 */}
      <g>
        <path d="M 35 40 Q -10 20, -30 10 Q 15 35, 35 40" fill={tailColor} />
        {tailCount > 1 && (
          <path d="M 35 40 Q -10 60, -30 70 Q 15 45, 35 40" fill={tailColor} />
        )}
        {tailCount > 2 && (
          <path d="M 35 40 Q -20 40, -40 40 Q 10 40, 35 40" fill={tailColor} />
        )}
      </g>
      
      {/* 彗星の核 */}
      <circle cx="35" cy="40" r="14" fill="#ffffff" stroke={color} strokeWidth="3.5" />
      <circle cx="35" cy="40" r="8" fill={color} />
    </svg>
  );
}

// ブラックホール
export function SVGBlackHole({ color = '#7209b7', gasColor = 'rgba(114,9,183,0.35)', diskScale = 1.0, angle = 0 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 120 120" style={{ transform: `rotate(${angle}deg)`, overflow: 'visible' }}>
      {/* 降着円盤 */}
      <g transform={`scale(${diskScale})`} style={{ transformOrigin: 'center' }}>
        <ellipse cx="60" cy="60" rx="55" ry="18" fill="none" stroke={gasColor} strokeWidth="15" strokeLinecap="round" opacity="0.6" transform="rotate(-15 60 60)" />
        <ellipse cx="60" cy="60" rx="45" ry="12" fill="none" stroke="#f72585" strokeWidth="6" opacity="0.8" transform="rotate(-15 60 60)" />
        <ellipse cx="60" cy="60" rx="35" ry="8" fill="none" stroke="#ffd166" strokeWidth="3" transform="rotate(-15 60 60)" />
      </g>
      
      {/* 中心のブラックホール */}
      <circle cx="60" cy="60" r="18" fill="#050510" stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="60" cy="60" r="14" fill="#000000" />
    </svg>
  );
}


// ==========================================
// 2. メインの描画ラッパーコンポーネント
//    パーセントベースで親コンテナに追従して伸縮
// ==========================================
export function SpaceObject({ type, size, x, y, angle, properties, isDiffMode = false }) {
  // 右画面（間違いモード）の時は、diffProps の上書きを適用
  const props = isDiffMode && properties.diffProps 
    ? { ...properties, ...properties.diffProps } 
    : properties;

  // もし非表示（消えている）の場合は描画しない
  if (props.visible === false) {
    return null;
  }

  // アスペクト比が16:10 (800x500) なので、横幅と縦幅の%比率を別々に計算
  const style = {
    position: 'absolute',
    left: `${(x / 800) * 100}%`,
    top: `${(y / 500) * 100}%`,
    width: `${(size / 800) * 100}%`,
    aspectRatio: '1/1',
    transform: `translate(-50%, -50%)`,
    cursor: 'pointer',
    transition: 'all 0.15s ease-out',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const renderSVG = () => {
    switch (type) {
      case 'star':
        return <SVGStar color={props.color} angle={angle} />;
      case 'moon':
        return <SVGMoon isSmile={props.isSmile} hasHat={props.hasHat} craterCount={props.craterCount} color={props.color} />;
      case 'rocket':
        return <SVGRocket color={props.color} windowCount={props.windowCount} hasFire={props.hasFire} wingColor={props.wingColor} angle={angle} />;
      case 'ufo':
        return <SVGUfo color={props.color} lightColor={props.lightColor} hasAntenna={props.hasAntenna} hasAlienInside={props.hasAlienInside} angle={angle} />;
      case 'astronaut':
        return <SVGAstronaut visorColor={props.visorColor} hasFlag={props.hasFlag} flagColor={props.flagColor} angle={angle} />;
      case 'alien':
        return <SVGAlien color={props.color} eyeCount={props.eyeCount} legCount={props.legCount} angle={angle} />;
      case 'planet':
        return <SVGPlanet planetType={props.planetType} hasRing={props.hasRing} color={props.color} ringColor={props.ringColor} angle={angle} />;
      case 'satellite':
        return <SVGSatellite hasDoublePanel={props.hasDoublePanel} hasSignal={props.hasSignal} angle={angle} />;
      case 'robot':
        return <SVGRobot color={props.color} hasAntenna={props.hasAntenna} eyeCount={props.eyeCount} bodyColor={props.bodyColor} angle={angle} />;
      case 'comet':
        return <SVGComet color={props.color} tailColor={props.tailColor} tailCount={props.tailCount} angle={angle} />;
      case 'blackhole':
        return <SVGBlackHole color={props.color} gasColor={props.gasColor} diskScale={props.diskScale} angle={angle} />;
      default:
        return null;
    }
  };

  return <div style={style}>{renderSVG()}</div>;
}


// ==========================================
// 3. 宇宙シーンの基本配置データ
// ==========================================

const SCENE_TEMPLATES = [
  {
    id: 'rocket_journey',
    name: 'ロケットの たび',
    nameRuby: '<ruby>宇宙船<rt>うちゅうせん</rt></ruby>の たび',
    bg: '#0c0f26',
    objects: [
      { id: 'earth', type: 'planet', x: 130, y: 360, size: 140, angle: 0, properties: { planetType: 'earth', color: '#118ab2' } },
      { id: 'rocket', type: 'rocket', x: 420, y: 220, size: 140, angle: 45, properties: { color: '#ef476f', windowCount: 2, hasFire: true, wingColor: '#118ab2' } },
      { id: 'astronaut', type: 'astronaut', x: 670, y: 350, size: 110, angle: -10, properties: { visorColor: '#118ab2', hasFlag: true, flagColor: '#ffb703' } },
      { id: 'star_big', type: 'star', x: 650, y: 90, size: 60, angle: 15, properties: { color: '#ffb703' } },
      { id: 'star_mid', type: 'star', x: 260, y: 120, size: 45, angle: 0, properties: { color: '#ffb703' } },
      { id: 'star_small1', type: 'star', x: 100, y: 80, size: 30, angle: 45, properties: { color: '#ffffff' } },
      { id: 'star_small2', type: 'star', x: 480, y: 420, size: 30, angle: -30, properties: { color: '#ffffff' } },
      { id: 'mars', type: 'planet', x: 340, y: 80, size: 70, angle: 0, properties: { planetType: 'mars', color: '#e76f51' } },
    ]
  },
  {
    id: 'alien_party',
    name: 'うちゅうじんの パーティー',
    nameRuby: 'うちゅうじんの パーティー',
    bg: '#0f0c24',
    objects: [
      { id: 'ufo', type: 'ufo', x: 230, y: 160, size: 135, angle: 5, properties: { color: '#06d6a0', lightColor: '#ffd166', hasAntenna: true, hasAlienInside: true } },
      { id: 'alien_green', type: 'alien', x: 580, y: 280, size: 110, angle: 0, properties: { color: '#ffd166', eyeCount: 3, legCount: 4 } },
      { id: 'alien_pink', type: 'alien', x: 740, y: 380, size: 85, angle: -15, properties: { color: '#ff85a1', eyeCount: 1, legCount: 3 } },
      { id: 'saturn', type: 'planet', x: 140, y: 390, size: 145, angle: -20, properties: { planetType: 'saturn', hasRing: true, color: '#ffd166', ringColor: '#ef476f' } },
      { id: 'star_neon', type: 'star', x: 420, y: 90, size: 55, angle: 10, properties: { color: '#06d6a0' } },
      { id: 'star_yellow', type: 'star', x: 460, y: 320, size: 45, angle: -10, properties: { color: '#ffd166' } },
      { id: 'star_small1', type: 'star', x: 730, y: 100, size: 30, angle: 25, properties: { color: '#ffffff' } },
      { id: 'satellite', type: 'satellite', x: 420, y: 220, size: 95, angle: 30, properties: { hasDoublePanel: true, hasSignal: true } },
    ]
  },
  {
    id: 'moon_sky',
    name: 'おつきさまと ほしぞら',
    nameRuby: 'おつきさまと <ruby>星空<rt>ほしぞら</rt></ruby>',
    bg: '#08081a',
    objects: [
      { id: 'moon', type: 'moon', x: 220, y: 220, size: 180, angle: 0, properties: { isSmile: true, hasHat: true, craterCount: 3, color: '#ffd166' } },
      { id: 'satellite', type: 'satellite', x: 720, y: 150, size: 110, angle: -20, properties: { hasDoublePanel: true, hasSignal: true } },
      { id: 'planet_blue', type: 'planet', x: 500, y: 380, size: 120, angle: 10, properties: { planetType: 'earth', color: '#118ab2' } },
      { id: 'star_big1', type: 'star', x: 480, y: 120, size: 60, angle: 0, properties: { color: '#ffd166' } },
      { id: 'star_big2', type: 'star', x: 780, y: 370, size: 50, angle: 20, properties: { color: '#ffb703' } },
      { id: 'star_small1', type: 'star', x: 120, y: 390, size: 35, angle: -45, properties: { color: '#ffffff' } },
      { id: 'star_small2', type: 'star', x: 100, y: 100, size: 30, angle: 15, properties: { color: '#ffffff' } },
      { id: 'astronaut_float', type: 'astronaut', x: 380, y: 280, size: 100, angle: 45, properties: { visorColor: '#ffd166', hasFlag: false, flagColor: '#ffb703' } },
    ]
  },
  {
    id: 'space_station',
    name: 'うちゅうステーションで おそうじ',
    nameRuby: 'うちゅうステーションで おそうじ',
    bg: '#0a0d2a',
    objects: [
      { id: 'satellite', type: 'satellite', x: 200, y: 160, size: 120, angle: -10, properties: { hasDoublePanel: true, hasSignal: true } },
      { id: 'robot', type: 'robot', x: 420, y: 320, size: 100, angle: 0, properties: { color: '#06d6a0', hasAntenna: true, eyeCount: 2, bodyColor: '#f8f9fa' } },
      { id: 'astronaut_clean', type: 'astronaut', x: 650, y: 220, size: 110, angle: 25, properties: { visorColor: '#ef476f', hasFlag: false, flagColor: '#ffb703' } },
      { id: 'earth_bg', type: 'planet', x: 130, y: 400, size: 160, angle: 0, properties: { planetType: 'earth', color: '#118ab2' } },
      { id: 'star_neon', type: 'star', x: 450, y: 90, size: 55, angle: 15, properties: { color: '#06d6a0' } },
      { id: 'star_small1', type: 'star', x: 740, y: 410, size: 30, angle: -20, properties: { color: '#ffffff' } },
      { id: 'star_small2', type: 'star', x: 780, y: 90, size: 35, angle: 45, properties: { color: '#ffffff' } }
    ]
  },
  {
    id: 'blackhole_comet',
    name: 'ほうき星と ちいさな探査機',
    nameRuby: 'ほうき<ruby>星<rt>ぼし</rt></ruby>と ちいさな<ruby>探査機<rt>たんさき</rt></ruby>',
    bg: '#07071f',
    objects: [
      { id: 'blackhole', type: 'blackhole', x: 220, y: 220, size: 160, angle: 0, properties: { color: '#7209b7', gasColor: 'rgba(114,9,183,0.35)', diskScale: 1.0 } },
      { id: 'comet', type: 'comet', x: 600, y: 150, size: 130, angle: -30, properties: { color: '#00bbf9', tailColor: 'rgba(0,187,249,0.35)', tailCount: 2 } },
      { id: 'probe_satellite', type: 'satellite', x: 480, y: 350, size: 100, angle: 45, properties: { hasDoublePanel: false, hasSignal: true } },
      { id: 'star_comet1', type: 'star', x: 120, y: 100, size: 50, angle: 10, properties: { color: '#ffb703' } },
      { id: 'star_comet2', type: 'star', x: 780, y: 360, size: 45, angle: -15, properties: { color: '#ffd166' } },
      { id: 'star_small1', type: 'star', x: 380, y: 90, size: 30, angle: 0, properties: { color: '#ffffff' } },
      { id: 'ufo_far', type: 'ufo', x: 740, y: 100, size: 70, angle: 10, properties: { color: '#ef476f', lightColor: '#ffd166', hasAntenna: false, hasAlienInside: false } }
    ]
  },
  {
    id: 'galaxy_drive',
    name: 'ぎんがの なかまたち',
    nameRuby: 'ぎんがの なかまたち',
    bg: '#0b0c26',
    objects: [
      { id: 'ufo_drive', type: 'ufo', x: 500, y: 200, size: 140, angle: -10, properties: { color: '#06d6a0', lightColor: '#ffd166', hasAntenna: true, hasAlienInside: true } },
      { id: 'alien_driver', type: 'alien', x: 230, y: 320, size: 110, angle: 15, properties: { color: '#ff85a1', eyeCount: 2, legCount: 4 } },
      { id: 'saturn_ring', type: 'planet', x: 750, y: 300, size: 150, angle: 25, properties: { planetType: 'saturn', hasRing: true, color: '#ffd166', ringColor: '#ef476f' } },
      { id: 'galaxy_core', type: 'blackhole', x: 160, y: 140, size: 110, angle: 45, properties: { color: '#4cc9f0', gasColor: 'rgba(76,201,240,0.25)', diskScale: 0.9 } },
      { id: 'star_gal1', type: 'star', x: 420, y: 400, size: 55, angle: 5, properties: { color: '#06d6a0' } },
      { id: 'star_gal2', type: 'star', x: 650, y: 90, size: 45, angle: -10, properties: { color: '#ffd166' } },
      { id: 'star_small1', type: 'star', x: 100, y: 380, size: 30, angle: 20, properties: { color: '#ffffff' } }
    ]
  }
];


// ==========================================
// 4. まちがい生成関数 (難易度に応じた変更を作成)
// ==========================================

export function generateGame(sceneId, difficulty) {
  const template = SCENE_TEMPLATES.find(s => s.id === sceneId) || SCENE_TEMPLATES[0];
  const scene = {
    ...template,
    objects: template.objects.map(obj => ({
      ...obj,
      properties: { ...obj.properties }
    }))
  };

  let diffCount = 3;
  if (difficulty === 'medium') diffCount = 4;
  if (difficulty === 'hard') diffCount = 5;

  const eligibleObjects = scene.objects.filter(obj => {
    if (difficulty === 'easy') {
      return obj.size >= 70;
    }
    return true;
  });

  const shuffled = [...eligibleObjects].sort(() => 0.5 - Math.random());
  const selectedObjects = shuffled.slice(0, diffCount);

  const differences = selectedObjects.map((obj, index) => {
    let diffProps = {};
    let description = '';

    switch (obj.type) {
      case 'star':
        if (Math.random() < 0.4 && difficulty !== 'easy') {
          diffProps = { visible: false };
          description = '星が消えている';
        } else {
          const colors = ['#ef476f', '#06d6a0', '#118ab2', '#ffffff'];
          const filteredColors = colors.filter(c => c !== obj.properties.color);
          const nextColor = filteredColors[Math.floor(Math.random() * filteredColors.length)];
          diffProps = { color: nextColor };
          description = '星の色がちがう';
        }
        break;

      case 'moon':
        const moonRnd = Math.random();
        if (moonRnd < 0.35) {
          diffProps = { isSmile: false };
          description = 'おつきさまの お口のかたちが ちがう';
        } else if (moonRnd < 0.7 && obj.properties.hasHat) {
          diffProps = { hasHat: false };
          description = 'おつきさまの ぼうしが ない';
        } else {
          diffProps = { craterCount: 0 };
          description = 'おつきさまの もようが ない';
        }
        break;

      case 'rocket':
        const rocketRnd = Math.random();
        if (rocketRnd < 0.3) {
          diffProps = { color: '#118ab2', wingColor: '#ef476f' };
          description = 'ロケットの色が ちがう';
        } else if (rocketRnd < 0.6) {
          diffProps = { windowCount: obj.properties.windowCount === 2 ? 1 : 2 };
          description = 'ロケットの まどの数が ちがう';
        } else {
          diffProps = { hasFire: false };
          description = 'ロケットの おしりの ほのおが ない';
        }
        break;

      case 'ufo':
        const ufoRnd = Math.random();
        if (ufoRnd < 0.35) {
          diffProps = { color: '#ef476f' };
          description = 'UFOの色が ちがう';
        } else if (ufoRnd < 0.7 && obj.properties.hasAntenna) {
          diffProps = { hasAntenna: false };
          description = 'UFOの アンテナが ない';
        } else {
          diffProps = { lightColor: '#ef476f' };
          description = 'UFOの ライトの色が ちがう';
        }
        break;

      case 'astronaut':
        const astroRnd = Math.random();
        if (astroRnd < 0.4 && obj.properties.hasFlag) {
          diffProps = { hasFlag: false };
          description = '宇宙飛行士の はたが ない';
        } else {
          diffProps = { visorColor: '#ffb703' };
          description = '宇宙飛行士の ヘルメットの色が ちがう';
        }
        break;

      case 'alien':
        const alienRnd = Math.random();
        if (alienRnd < 0.4) {
          diffProps = { eyeCount: obj.properties.eyeCount === 3 ? 1 : 3 };
          description = '宇宙人の 目の数が ちがう';
        } else {
          const nextColor = obj.properties.color === '#ffd166' ? '#06d6a0' : '#ffd166';
          diffProps = { color: nextColor };
          description = '宇宙人の 体の色が ちがう';
        }
        break;

      case 'planet':
        const planetRnd = Math.random();
        if (planetRnd < 0.4 && obj.properties.planetType === 'saturn') {
          diffProps = { hasRing: false };
          description = '土星の わっかが ない';
        } else {
          const nextColor = obj.properties.color === '#118ab2' ? '#ef476f' : '#118ab2';
          diffProps = { color: nextColor };
          description = 'わくせいの 色が ちがう';
        }
        break;

      case 'satellite':
        const satRnd = Math.random();
        if (satRnd < 0.5) {
          diffProps = { hasDoublePanel: false };
          description = '人工衛星の はねが かたほうない';
        } else {
          diffProps = { hasSignal: false };
          description = '人工衛星의 でんぱが でていない';
        }
        break;

      case 'robot':
        const botRnd = Math.random();
        if (botRnd < 0.4 && obj.properties.hasAntenna) {
          diffProps = { hasAntenna: false };
          description = 'ロボットの アンテナが ない';
        } else {
          diffProps = { eyeCount: obj.properties.eyeCount === 2 ? 1 : 2 };
          description = 'ロボットの 目の数が ちがう';
        }
        break;

      case 'comet':
        const cometRnd = Math.random();
        if (cometRnd < 0.5) {
          diffProps = { tailCount: obj.properties.tailCount === 2 ? 1 : 2 };
          description = 'ほうき星の しっぽの 数が ちがう';
        } else {
          diffProps = { color: '#ffb703' };
          description = 'ほうき星の 色が ちがう';
        }
        break;

      case 'blackhole':
        const bhRnd = Math.random();
        if (bhRnd < 0.5) {
          diffProps = { diskScale: 0.6 };
          description = 'ブラックホールの まわりの 渦の大きさが ちがう';
        } else {
          diffProps = { color: '#ff8500' };
          description = 'ブラックホールの まわりの 色が ちがう';
        }
        break;

      default:
        diffProps = { color: '#ffffff' };
        description = 'なにかが ちがうよ';
    }

    obj.properties.diffProps = diffProps;

    return {
      id: obj.id,
      index,
      x: obj.x,
      y: obj.y,
      size: obj.size,
      description,
      found: false
    };
  });

  return {
    ...scene,
    differences
  };
}

export const spotDifferenceData = {
  SCENE_TEMPLATES,
  generateGame
};
