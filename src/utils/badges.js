import {
  BADGE_POOL,
  CATEGORIES,
  DIFFICULTY_MAP,
  MODE_MAP,
  TEST_PROJECTS,
  PROJECT_IMAGE_MAP
} from '../data/badgesData.js';

// 再エクスポート（他のコンポーネントとの後方互換性を保持）
export {
  BADGE_POOL,
  CATEGORIES,
  DIFFICULTY_MAP,
  MODE_MAP,
  TEST_PROJECTS,
  PROJECT_IMAGE_MAP
};

/**
 * 合格回数から、プロジェクトの進行状況と完成済みのプロジェクトリストを返す
 */
export function getProjectStatus(badgeId, count) {
  const projects = TEST_PROJECTS[badgeId];
  if (!projects) return null;

  if (count <= 0) {
    return {
      currentProjectIndex: 0,
      currentProject: projects[0],
      currentPartIndex: -1, // まだパーツを1つも持っていない
      isAllCompleted: false,
      completedList: []
    };
  }

  const maxProjectCount = projects.length; // 4
  // 1つのプロジェクトは5回の合格で完成。
  // 合格回数から、現在どのプロジェクトを組み立て中かを判定
  const currentProjectIndex = Math.min(maxProjectCount - 1, Math.floor((count - 1) / 5));

  let currentPartIndex = 0;
  if (count >= maxProjectCount * 5) {
    currentPartIndex = 4; // すべて完成している場合は、最後のプロジェクトの「完成体」
  } else {
    currentPartIndex = (count - 1) % 5;
  }

  const isAllCompleted = count >= maxProjectCount * 5;

  // 完成済みのプロジェクトリストを抽出
  const completedList = [];
  const completedCount = Math.min(maxProjectCount, Math.floor(count / 5));
  for (let i = 0; i < completedCount; i++) {
    const proj = projects[i];
    completedList.push({
      id: proj.id,
      name: proj.name,
      emoji: proj.parts[4].emoji,
      color: badgeId === 'b_test_3' ? '#4cc9f0' : '#ffd166', // 級に合わせた色
      desc: proj.parts[4].desc,
      projectIndex: i,
      image: '/images/' + PROJECT_IMAGE_MAP[proj.id],
      parts: proj.parts
    });
  }

  return {
    currentProjectIndex,
    currentProject: projects[currentProjectIndex],
    currentPartIndex, // 0 = パーツ1, 1 = パーツ2, 2 = パーツ3, 3 = パーツ4, 4 = 完成体
    isAllCompleted,
    completedList
  };
}

const VARIED_REAL_PHOTOS = {
  planets: [
    '/assets/images/quiz/earth.png',
    '/assets/images/quiz/mars.png',
    '/assets/images/quiz/jupiter.png',
    '/assets/images/quiz/saturn.png',
    '/assets/images/quiz/mercury.png',
    '/assets/images/quiz/uranus.png',
    '/assets/images/quiz/neptune.png',
    '/assets/images/quiz/pluto.png',
    '/assets/images/quiz/moon.png',
    '/assets/images/badges/venus.png'
  ],
  vehicles: [
    '/assets/images/quiz/rocket_h3.png',
    '/assets/images/quiz/iss.png',
    '/images/p_hubble.png',
    '/images/p_jwst.png',
    '/images/p_artemis.png',
    '/images/p_voyager.png',
    '/images/p_lunar_rover.png',
    '/images/p_hayabusa2.png',
    '/assets/images/quiz/space_suit.png'
  ],
  satellites: [
    '/assets/images/quiz/europa.png',
    '/assets/images/quiz/titan.png',
    '/assets/images/quiz/io.png',
    '/assets/images/quiz/akatsuki.png',
    '/assets/images/quiz/kaguya.png',
    '/assets/images/quiz/juno.png',
    '/assets/images/quiz/mir.png',
    '/images/p_voyager.png',
    '/images/p_iss.png'
  ],
  astronomers: [
    '/assets/images/badges/galileo.png',
    '/assets/images/badges/copernicus.png',
    '/assets/images/badges/newton.png',
    '/assets/images/badges/einstein.png',
    '/assets/images/badges/le_verrier.png'
  ],
  space: [
    '/assets/images/quiz/milky_way.png',
    '/assets/images/quiz/black_hole.png',
    '/assets/images/quiz/orion.png',
    '/assets/images/badges/gemini.png',
    '/assets/images/quiz/sun.png'
  ]
};

function getVariedPhotoForBadge(badge) {
  if (badge.image) return badge.image;
  const list = VARIED_REAL_PHOTOS[badge.category] || VARIED_REAL_PHOTOS.planets;
  let hash = 0;
  for (let i = 0; i < badge.id.length; i++) {
    hash = (hash << 5) - hash + badge.id.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % list.length;
  return list[index];
}

/**
 * 獲得回数に応じてバッジ情報（絵文字、名前、説明、実写画像）を動的に差し替えて返す
 */
export function getDynamicBadgeInfo(badge, count = 1) {
  if (!badge) return null;

  // 実写写真画像の確定（指定がある場合はその画像、未指定の場合はIDハッシュによるバリエーション豊かなリアル写真）
  const realImage = getVariedPhotoForBadge(badge);

  if (badge.id === 'b_test_4' || badge.id === 'b_test_3') {
    const status = getProjectStatus(badge.id, count);
    if (status && status.currentProject) {
      const part = status.currentProject.parts[status.currentPartIndex];
      if (part) {
        return {
          ...badge,
          name: status.currentPartIndex === 4
            ? `${status.currentProject.name}（かんせい！）`
            : `${status.currentProject.name}の ${part.name}`,
          emoji: part.emoji,
          desc: part.desc,
          image: status.currentPartIndex === 4
            ? '/images/' + PROJECT_IMAGE_MAP[status.currentProject.id]
            : realImage
        };
      }
    }
  }

  return {
    ...badge,
    image: realImage
  };
}

/**
 * 獲得された最高難易度に基づいて、バッジのフチ色（ボーダー色）を返す
 */
export function getBadgeBorderColor(earnedInfo) {
  if (!earnedInfo || !earnedInfo.earnedDetails || earnedInfo.earnedDetails.length === 0) {
    return 'rgba(255, 255, 255, 0.15)'; // 未獲得時のデフォルト
  }

  const difficulties = earnedInfo.earnedDetails.map(d => d.difficulty);

  if (difficulties.includes('hard')) {
    return '#ffb703'; // 金色 (むずかしい)
  }
  if (difficulties.includes('medium') || difficulties.includes('3')) {
    return '#3a86ff'; // 青 (ふつう / 3きゅう)
  }
  if (difficulties.includes('easy') || difficulties.includes('4')) {
    return '#ffffff'; // 白 (やさしい / 4きゅう)
  }

  return '#ffffff'; // デフォルト白
}
