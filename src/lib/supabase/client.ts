import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Supabaseが設定されているかどうかのフラグ
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Supabaseクライアント（環境変数が設定されていない場合はnull）
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null;

// 認証ヘルパー関数
export async function signIn(email: string, password: string) {
  if (!supabase) {
    // モックモード：デモ用に成功を返す
    console.warn('Supabase not configured. Running in mock mode.');
    return {
      user: { id: 'mock-user', email },
      session: { access_token: 'mock-token' },
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) {
    console.warn('Supabase not configured. Running in mock mode.');
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) {
    return null;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
