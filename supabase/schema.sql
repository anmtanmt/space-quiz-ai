-- ===================================================================
-- 宇宙クイズ-AI: Supabase データベーススキーマ & RLSポリシー
-- Supabase の「SQL Editor」に貼り付けて実行するだけで初期設定が完了します。
-- ===================================================================

-- 1. profiles テーブル（ユーザー情報 & 課金・利用ステータス管理）
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  daily_ai_count INT NOT NULL DEFAULT 0,
  last_ai_play_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Row Level Security (RLS) の有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ユーザー自身のみが自分のプロフィールを参照・更新可能
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- 3. 新規ユーザー登録時に自動で profiles レコードを作成するトリガー関数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, plan, daily_ai_count, subscription_status)
  VALUES (NEW.id, NEW.email, 'free', 0, 'none');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存のトリガーがあれば削除して再作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. AIクイズ利用回数カウント & 24時間リセットを安全に行うRPC関数
CREATE OR REPLACE FUNCTION public.increment_ai_usage()
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_plan TEXT;
  v_count INT;
  v_last_play TIMESTAMPTZ;
  v_now TIMESTAMPTZ := NOW();
  v_can_play BOOLEAN := FALSE;
  v_remaining INT := 0;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT plan, daily_ai_count, last_ai_play_at 
  INTO v_plan, v_count, v_last_play
  FROM public.profiles 
  WHERE id = v_user_id;

  -- プレミアム会員は無制限
  IF v_plan = 'premium' THEN
    UPDATE public.profiles 
    SET last_ai_play_at = v_now, updated_at = v_now
    WHERE id = v_user_id;
    
    RETURN jsonb_build_object(
      'success', true, 
      'plan', 'premium', 
      'remaining', 999,
      'isUnlimited', true
    );
  END IF;

  -- 無料会員の場合: 最後のプレイから24時間以上経過していればカウントリセット
  IF v_last_play IS NULL OR v_now >= (v_last_play + INTERVAL '24 hours') THEN
    v_count := 0;
  END IF;

  -- 1日2回上限チェック
  IF v_count < 2 THEN
    v_count := v_count + 1;
    v_can_play := TRUE;
    v_remaining := 2 - v_count;

    UPDATE public.profiles 
    SET daily_ai_count = v_count, 
        last_ai_play_at = CASE WHEN v_count = 1 THEN v_now ELSE v_last_play END,
        updated_at = v_now
    WHERE id = v_user_id;
  ELSE
    v_can_play := FALSE;
    v_remaining := 0;
  END IF;

  RETURN jsonb_build_object(
    'success', v_can_play,
    'plan', 'free',
    'count', v_count,
    'remaining', v_remaining,
    'lastPlayAt', v_last_play,
    'resetAt', CASE WHEN v_last_play IS NOT NULL THEN v_last_play + INTERVAL '24 hours' ELSE NULL END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
