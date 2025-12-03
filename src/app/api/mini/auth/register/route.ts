import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { UserRegisterSchema } from '@/lib/utils/validation';
import type { Database } from '@/lib/supabase/database.types';

type UserRow = Database['public']['Tables']['users']['Row'];

// Supabaseクライアントを取得（型安全）
function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = UserRegisterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_INPUT',
          message: '入力内容に誤りがあります',
        },
        { status: 400 }
      );
    }

    const { lineUserId, displayName, avatarUrl } = validationResult.data;

    // Supabase未設定の場合はモックレスポンスを返す
    if (!isSupabaseAdminConfigured) {
      return NextResponse.json({
        success: true,
        user: {
          id: lineUserId,
          displayName: displayName || 'モックユーザー',
          avatarUrl: avatarUrl || null,
          createdAt: new Date().toISOString(),
        },
        isNewUser: true,
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { data: existingUserData } = await supabase
      .from('users')
      .select('*')
      .eq('id', lineUserId)
      .single();

    if (existingUserData) {
      const { data: updatedUserData, error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          last_login_at: new Date().toISOString(),
        })
        .eq('id', lineUserId)
        .select()
        .single();

      if (error) throw error;

      const updatedUser = updatedUserData as UserRow;

      return NextResponse.json({
        success: true,
        user: {
          id: updatedUser.id,
          displayName: updatedUser.display_name,
          avatarUrl: updatedUser.avatar_url,
          createdAt: updatedUser.created_at,
        },
        isNewUser: false,
      });
    }

    const { data: newUserData, error } = await supabase
      .from('users')
      .insert({
        id: lineUserId,
        display_name: displayName,
        avatar_url: avatarUrl,
      })
      .select()
      .single();

    if (error) throw error;

    const newUser = newUserData as UserRow;

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        displayName: newUser.display_name,
        avatarUrl: newUser.avatar_url,
        createdAt: newUser.created_at,
      },
      isNewUser: true,
    });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'SERVER_ERROR',
        message: 'サーバーエラーが発生しました',
      },
      { status: 500 }
    );
  }
}
