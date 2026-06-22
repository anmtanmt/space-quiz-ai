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
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get earned badges', e);
      return [];
    }
  },

  addEarnedBadge: (badgeId) => {
    try {
      const badges = storage.getEarnedBadges();
      if (!badges.includes(badgeId)) {
        badges.push(badgeId);
        localStorage.setItem(KEYS.EARNED_BADGES, JSON.stringify(badges));
        return true; // 新規追加成功
      }
      return false; // すでに所持している
    } catch (e) {
      console.error('Failed to add earned badge', e);
      return false;
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
