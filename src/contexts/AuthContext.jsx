import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  supabase, 
  isSupabaseConfigured, 
  signUpWithEmail, 
  signInWithEmail, 
  signOut as supabaseSignOut, 
  fetchUserProfile 
} from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // 初回セッション取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // 認証状態の変更リスナー
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  // ローカル/モック用プラン状態（未ログインやテスト時にも即座に体験可能）
  const [localPlan, setLocalPlan] = useState(() => {
    try {
      return localStorage.getItem('sq_mock_plan') || 'free';
    } catch (e) {
      return 'free';
    }
  });

  // URLクエリパラメータの検知（Stripe Checkout完了後の戻り時）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('checkout_success') === 'true') {
        upgradeToPremium();
        // クエリパラメータをクリーンアップ
        const url = new URL(window.location);
        url.searchParams.delete('checkout_success');
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
  const upgradeToPremium = async () => {
    setLocalPlan('premium');
    try {
      localStorage.setItem('sq_mock_plan', 'premium');
    } catch (e) { }

    if (user && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ plan: 'premium', updated_at: new Date().toISOString() })
          .eq('id', user.id);
        await loadProfile(user.id);
      } catch (err) {
        console.warn('Failed to update plan in Supabase:', err);
      }
    }
  };

  // プラン変更（無料プランへ戻す）
  const downgradeToFree = async () => {
    setLocalPlan('free');
    try {
      localStorage.setItem('sq_mock_plan', 'free');
    } catch (e) { }

    if (user && isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ plan: 'free', updated_at: new Date().toISOString() })
          .eq('id', user.id);
        await loadProfile(user.id);
      } catch (err) {
        console.warn('Failed to downgrade plan in Supabase:', err);
      }
    }
  };

  const isPremium = (profile?.plan === 'premium') || (localPlan === 'premium');

  const value = {
    user,
    profile,
    loading,
    isConfigured: isSupabaseConfigured,
    isPremium,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
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
