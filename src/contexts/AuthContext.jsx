import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  isSupabaseConfigured, 
  signUpWithEmail, 
  signInWithEmail, 
  signOut as supabaseSignOut, 
  fetchUserProfile,
  sendPasswordResetEmail as supabaseSendPasswordResetEmail,
  updateUserPassword as supabaseUpdateUserPassword
} from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  // プロフィールの読み込み
  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const prof = await fetchUserProfile(userId);
    setProfile(prof);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // URLハッシュに type=recovery が含まれているか確認
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setIsPasswordRecovery(true);
    }

    // 初回セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // 認証状態の変更リスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        loadProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ローカルプラン詳細状態（サブスク or 30日買い切りパス）
  const [planInfo, setPlanInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('sq_plan_info');
      if (saved) {
        return JSON.parse(saved);
      }
      // 後方互換性
      const mock = localStorage.getItem('sq_mock_plan');
      if (mock === 'premium') {
        return { plan: 'premium', type: 'subscription', expiresAt: null };
      }
      return { plan: 'free', type: 'free', expiresAt: null };
    } catch (e) {
      return { plan: 'free', type: 'free', expiresAt: null };
    }
  });

  // 買い切りパスの有効期限チェック（毎分およびマウント時）
  useEffect(() => {
    const checkExpiration = () => {
      if (planInfo.type === 'pass_30d' && planInfo.expiresAt) {
        if (Date.now() >= planInfo.expiresAt) {
          // 期限切れ -> 自動で無料プランへ
          console.info('30-day pass expired. Reverting to free plan.');
          downgradeToFree();
        }
      }
    };

    checkExpiration();
    const timer = setInterval(checkExpiration, 1000 * 30); // 30秒ごとに期限チェック
    return () => clearInterval(timer);
  }, [planInfo]);

  // URLクエリパラメータの検知（Stripe Checkout正規完了後の戻り時）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isCheckoutSuccess = params.get('checkout_success') === 'true' && Boolean(params.get('session_id'));
      const isDevTestParam = import.meta.env.DEV && (params.get('plan') === 'pass_30d' || params.get('plan') === 'premium');

      if (isCheckoutSuccess || isDevTestParam) {
        const plan = params.get('plan') || 'subscription';
        const targetPlan = plan === 'pass_30d' ? 'pass_30d' : 'subscription';
        upgradeToPremium(targetPlan, 30);
        // クエリパラメータをクリーンアップ
        const url = new URL(window.location);
        url.searchParams.delete('checkout_success');
        url.searchParams.delete('plan');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, '', url.pathname);
      }
    }
  }, []);

  const handleSignUp = async (email, password) => {
    const data = await signUpWithEmail(email, password);
    if (data?.user) {
      setUser(data.user);
      await loadProfile(data.user.id);
    }
    return data;
  };

  const handleSignIn = async (email, password) => {
    const data = await signInWithEmail(email, password);
    if (data?.user) {
      setUser(data.user);
      await loadProfile(data.user.id);
    }
    return data;
  };

  const handleSignOut = async () => {
    await supabaseSignOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  // プラン変更（プレミアム昇格）
  const upgradeToPremium = async (type = 'subscription', durationDays = 30) => {
    let expiresAt = null;
    if (type === 'pass_30d') {
      expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
    }

    const newPlanInfo = {
      plan: 'premium',
      type,
      expiresAt
    };

    setPlanInfo(newPlanInfo);
    try {
      localStorage.setItem('sq_plan_info', JSON.stringify(newPlanInfo));
      localStorage.setItem('sq_mock_plan', 'premium');
    } catch (e) { }

    if (user && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ 
            plan: 'premium', 
            plan_type: type,
            plan_expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
            updated_at: new Date().toISOString() 
          })
          .eq('id', user.id);
        await loadProfile(user.id);
      } catch (err) {
        console.warn('Failed to update plan in Supabase:', err);
      }
    }
  };

  // プラン変更（無料プランへ戻す）
  const downgradeToFree = async () => {
    const freePlanInfo = { plan: 'free', type: 'free', expiresAt: null };
    setPlanInfo(freePlanInfo);
    try {
      localStorage.setItem('sq_plan_info', JSON.stringify(freePlanInfo));
      localStorage.setItem('sq_mock_plan', 'free');
    } catch (e) { }

    if (user && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ plan: 'free', plan_type: null, plan_expires_at: null, updated_at: new Date().toISOString() })
          .eq('id', user.id);
        await loadProfile(user.id);
      } catch (err) {
        console.warn('Failed to downgrade plan in Supabase:', err);
      }
    }
  };

  // 有効期限判定を含めたプレミアム判定
  const isExpired = planInfo.type === 'pass_30d' && planInfo.expiresAt && Date.now() >= planInfo.expiresAt;
  const isPremium = !isExpired && ((profile?.plan === 'premium') || (planInfo.plan === 'premium'));
  const planType = isPremium ? planInfo.type : 'free';
  const planExpiresAt = planInfo.expiresAt;
  const planRemainingMs = planExpiresAt ? Math.max(0, planExpiresAt - Date.now()) : 0;

  const handleResetPassword = async (email) => {
    return await supabaseSendPasswordResetEmail(email);
  };

  const handleUpdatePassword = async (newPassword) => {
    const data = await supabaseUpdateUserPassword(newPassword);
    setIsPasswordRecovery(false);
    // URLのハッシュを綺麗にする
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    return data;
  };

  const handleCancelRecovery = () => {
    setIsPasswordRecovery(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const value = {
    user,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    isPremium,
    planType,
    planExpiresAt,
    planRemainingMs,
    isPasswordRecovery,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    cancelRecovery: handleCancelRecovery,
    refreshProfile,
    upgradeToPremium,
    downgradeToFree
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
