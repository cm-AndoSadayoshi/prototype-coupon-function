import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabaseが設定されているかどうかのフラグ
export const isSupabaseAdminConfigured: boolean = !!(supabaseUrl && supabaseServiceKey);

// サーバーサイド用クライアント（RLSをバイパス）
// 環境変数が設定されていない場合はnull
let _supabaseAdmin: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseServiceKey) {
  _supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = _supabaseAdmin;

// 型安全にSupabaseクライアントを取得するヘルパー関数
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!_supabaseAdmin) {
    throw new Error('Supabase admin client is not configured');
  }
  return _supabaseAdmin;
}
