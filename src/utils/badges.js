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

/**
 * 獲得回数に応じてバッジ情報（絵文字、名前、説明）を動的に差し替えて返す
 */
export function getDynamicBadgeInfo(badge, count = 1) {
  if (!badge) return null;

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
            : null
        };
      }
    }
  }

  return badge;
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
