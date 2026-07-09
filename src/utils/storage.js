// LocalStorage用の管理ユーティリティ

const KEYS = {
  ANSWERED_IDS: 'sq_answered_ids',
  PARENT_QUIZZES: 'sq_parent_quizzes',
  EARNED_BADGES: 'sq_earned_badges'
};

export const storage = {
  // --- 回答履歴管理 ---
  getAnsweredIds: () => {
    try {
      const data = localStorage.getItem(KEYS.ANSWERED_IDS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get answered IDs', e);
      return [];
    }
  },

  saveAnsweredId: (id) => {
    try {
      const ids = storage.getAnsweredIds();
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem(KEYS.ANSWERED_IDS, JSON.stringify(ids));
      }
    } catch (e) {
      console.error('Failed to save answered ID', e);
    }
  },

  clearAnsweredIds: () => {
    try {
      localStorage.removeItem(KEYS.ANSWERED_IDS);
    } catch (e) {
      console.error('Failed to clear answered IDs', e);
    }
  },

  // --- おとなの手作りクイズ管理 ---
  getParentQuizzes: () => {
    try {
      const data = localStorage.getItem(KEYS.PARENT_QUIZZES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get parent quizzes', e);
      return [];
    }
  },

  saveParentQuiz: (quiz) => {
    try {
      const quizzes = storage.getParentQuizzes();
      // 新規の場合はIDを生成、編集の場合は上書き
      if (!quiz.id) {
        quiz.id = 'pq_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        quizzes.push(quiz);
      } else {
        const index = quizzes.findIndex(q => q.id === quiz.id);
        if (index !== -1) {
          quizzes[index] = quiz;
        } else {
          quizzes.push(quiz);
        }
      }
      localStorage.setItem(KEYS.PARENT_QUIZZES, JSON.stringify(quizzes));
      return quiz;
    } catch (e) {
      console.error('Failed to save parent quiz', e);
      return null;
    }
  },

  deleteParentQuiz: (id) => {
    try {
      const quizzes = storage.getParentQuizzes();
      const filtered = quizzes.filter(q => q.id !== id);
      localStorage.setItem(KEYS.PARENT_QUIZZES, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete parent quiz', e);
    }
  },

  // --- ごほうびバッジ管理 ---
  getEarnedBadges: () => {
    try {
      const data = localStorage.getItem(KEYS.EARNED_BADGES);
      if (!data) return [];
      const parsed = JSON.parse(data);
      
      // 旧ID -> 新IDのマッピング
      const idMap = {
        'badge_earth': 'b_earth',
        'badge_moon': 'b_moon',
        'badge_sun': 'b_sun',
        'badge_saturn': 'b_saturn',
        'badge_mars': 'b_mars',
        'badge_rocket': 'b_rocket',
        'badge_astronaut': 'b_space_suit',
        'badge_ufo': 'b_ufo'
      };

      // マイグレーション: 旧形式の文字列配列から新形式のオブジェクト配列へ自動変換、およびIDの更新
      let migrated = false;
      const badges = parsed.map(item => {
        if (typeof item === 'string') {
          migrated = true;
          const newId = idMap[item] || item;
          return {
            id: newId,
            count: 1,
            earnedDates: [],
            earnedDetails: []
          };
        }
        if (item && typeof item === 'object') {
          let updated = { ...item };
          if (item.id && idMap[item.id]) {
            updated.id = idMap[item.id];
            migrated = true;
          }
          if (!updated.earnedDetails) {
            migrated = true;
            const dates = updated.earnedDates || [];
            updated.earnedDetails = dates.map(date => ({
              date: date,
              difficulty: 'easy',
              mode: 'ai'
            }));
          }
          return updated;
        }
        return item;
      });

      if (migrated) {
        localStorage.setItem(KEYS.EARNED_BADGES, JSON.stringify(badges));
      }
      return badges;
    } catch (e) {
      console.error('Failed to get earned badges', e);
      return [];
    }
  },

  addEarnedBadge: (badgeId, difficulty = 'easy', mode = 'ai') => {
    try {
      const badges = storage.getEarnedBadges();
      const today = new Date().toLocaleDateString('ja-JP');
      const index = badges.findIndex(b => b.id === badgeId);
      const detail = {
        date: today,
        difficulty,
        mode
      };

      if (index === -1) {
        // 新規獲得
        badges.push({
          id: badgeId,
          count: 1,
          earnedDates: [today],
          earnedDetails: [detail]
        });
        localStorage.setItem(KEYS.EARNED_BADGES, JSON.stringify(badges));
        return { isNew: true, count: 1 };
      } else {
        // 2回目以降の獲得（2週目対応）
        badges[index].count += 1;
        if (!badges[index].earnedDates) {
          badges[index].earnedDates = [];
        }
        badges[index].earnedDates.push(today);
        if (!badges[index].earnedDetails) {
          badges[index].earnedDetails = [];
        }
        badges[index].earnedDetails.push(detail);
        localStorage.setItem(KEYS.EARNED_BADGES, JSON.stringify(badges));
        return { isNew: false, count: badges[index].count };
      }
    } catch (e) {
      console.error('Failed to add earned badge', e);
      return null;
    }
  },

  clearEarnedBadges: () => {
    try {
      localStorage.removeItem(KEYS.EARNED_BADGES);
    } catch (e) {
      console.error('Failed to clear earned badges', e);
    }
  },

  // --- 全体リセット（手作りクイズは残し、子どもの回答履歴とバッジのみリセット） ---
  resetChildData: () => {
    storage.clearAnsweredIds();
    storage.clearEarnedBadges();
  }
};
