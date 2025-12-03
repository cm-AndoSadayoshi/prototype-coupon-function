-- =====================================================
-- BEAMS クーポンアプリ データベーススキーマ
-- =====================================================

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- coupons テーブル
-- =====================================================
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_to TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_limit INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupons_validity ON coupons(valid_from, valid_to);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_coupons_updated_at 
  BEFORE UPDATE ON coupons
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- users テーブル
-- =====================================================
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- LINE User ID (sub)
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- =====================================================
-- user_coupons テーブル
-- =====================================================
CREATE TABLE user_coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  used_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('used', 'unused')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, coupon_id, created_at)
);

-- インデックス
CREATE INDEX idx_user_coupons_user_id ON user_coupons(user_id);
CREATE INDEX idx_user_coupons_coupon_id ON user_coupons(coupon_id);
CREATE INDEX idx_user_coupons_status ON user_coupons(status);
CREATE INDEX idx_user_coupons_used_at ON user_coupons(used_at DESC);

-- =====================================================
-- RLS (Row Level Security) ポリシー
-- =====================================================

-- coupons テーブルのRLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 誰でも有効なクーポンを閲覧可能
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

-- 認証済みユーザーは全てのクーポンを閲覧可能（管理者用）
CREATE POLICY "Authenticated users can view all coupons"
  ON coupons FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザーはクーポンを作成可能（管理者用）
CREATE POLICY "Authenticated users can insert coupons"
  ON coupons FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 認証済みユーザーはクーポンを更新可能（管理者用）
CREATE POLICY "Authenticated users can update coupons"
  ON coupons FOR UPDATE
  TO authenticated
  USING (true);

-- 認証済みユーザーはクーポンを削除可能（管理者用）
CREATE POLICY "Authenticated users can delete coupons"
  ON coupons FOR DELETE
  TO authenticated
  USING (true);

-- users テーブルのRLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 誰でもユーザー情報を閲覧可能（APIレベルで制御）
CREATE POLICY "Anyone can view users"
  ON users FOR SELECT
  USING (true);

-- 誰でもユーザーを作成可能
CREATE POLICY "Anyone can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- 誰でも自分のユーザー情報を更新可能
CREATE POLICY "Anyone can update users"
  ON users FOR UPDATE
  USING (true);

-- user_coupons テーブルのRLS
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;

-- 誰でも使用履歴を閲覧可能（APIレベルで制御）
CREATE POLICY "Anyone can view user_coupons"
  ON user_coupons FOR SELECT
  USING (true);

-- 誰でも使用履歴を作成可能
CREATE POLICY "Anyone can insert user_coupons"
  ON user_coupons FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- Realtime 設定
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE user_coupons;

-- =====================================================
-- サンプルデータ（開発用）
-- =====================================================
INSERT INTO coupons (title, description, valid_from, valid_to, is_active, usage_limit)
VALUES 
  (
    '全品10%OFF',
    '店内全商品が10%割引でお買い求めいただけます。一部商品（アクセサリー、セール品）を除きます。',
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '30 days',
    true,
    1
  ),
  (
    '2点目半額キャンペーン',
    '2点以上お買い上げで2点目が50%OFF！コーディネート買いにおすすめです。',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '14 days',
    true,
    1
  ),
  (
    '3,000円OFF',
    '10,000円以上のお買い上げで3,000円割引。高品質なアイテムをお得にゲット！',
    NOW(),
    NOW() + INTERVAL '21 days',
    true,
    1
  ),
  (
    '送料無料クーポン',
    'オンラインストアでのお買い物が送料無料になります。',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '37 days',
    true,
    1
  ),
  (
    '会員限定20%OFF',
    'LINE友だち限定！店内全商品が20%割引でお買い求めいただけます。',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '1 day',
    false,
    1
  );

-- サンプルユーザー
INSERT INTO users (id, display_name, avatar_url)
VALUES 
  ('U0000000000000001', 'テストユーザー1', NULL),
  ('U0000000000000002', 'テストユーザー2', NULL);

