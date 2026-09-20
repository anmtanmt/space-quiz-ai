import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabaseが設定されているかどうかのフラグ
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// クライアントの作成（未設定の場合はnull）
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * ユーザー登録 (サインアップ)
 */
export async function signUpWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabaseが設定されていません。');
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * ログイン (サインイン)
 */
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabaseが設定されていません。');
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

/**
 * ログアウト (サインアウト)
 */
export async function signOut() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * ユーザーのプロファイル情報を取得
 */
export async function fetchUserProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

/**
 * AIクイズの利用カウント実行 & 残り回数取得 (RPC呼び出し)
 */
export async function incrementAiUsage() {
  if (!isSupabaseConfigured) {
    // Supabase未設定時は制限なしまたはローカルモックとして通す
    return { success: true, plan: 'free', remaining: 2, isUnlimited: false };
  }
  const { data, error } = await supabase.rpc('increment_ai_usage');
  if (error) {
    console.error('Error in increment_ai_usage RPC:', error);
    throw error;
  }
  return data;
}
