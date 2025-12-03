import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { mockUsageLogs } from '@/lib/mock/data';
import type { Database } from '@/lib/supabase/database.types';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Supabase未設定の場合はモックデータを返す
    if (!isSupabaseAdminConfigured) {
      const paginatedLogs = mockUsageLogs.slice(offset, offset + limit);

      return NextResponse.json({
        success: true,
        logs: paginatedLogs.map((log) => ({
          id: log.id,
          user: {
            id: log.user.id,
            displayName: log.user.display_name,
            avatarUrl: log.user.avatar_url,
          },
          coupon: {
            id: log.coupon.id,
            title: log.coupon.title,
          },
          usedAt: log.used_at,
          status: log.status,
        })),
        total: mockUsageLogs.length,
        limit,
        offset,
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const couponId = searchParams.get('couponId');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    let query = supabase
      .from('user_coupons')
      .select(
        `
        id,
        user_id,
        coupon_id,
        used_at,
        status,
        created_at,
        users (
          id,
          display_name,
          avatar_url
        ),
        coupons (
          id,
          title
        )
      `,
        { count: 'exact' }
      )
      .eq('status', 'used')
      .order('used_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (couponId) {
      query = query.eq('coupon_id', couponId);
    }
    if (from) {
      query = query.gte('used_at', from);
    }
    if (to) {
      query = query.lte('used_at', to);
    }

    const { data: logs, count, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      logs:
        (logs || []).map((log) => ({
          id: log.id,
          user: {
            id: log.user_id,
            displayName: (log.users as { display_name?: string } | null)?.display_name || null,
            avatarUrl: (log.users as { avatar_url?: string } | null)?.avatar_url || null,
          },
          coupon: {
            id: log.coupon_id,
            title: (log.coupons as { title?: string } | null)?.title || '',
          },
          usedAt: log.used_at,
          status: log.status,
        })),
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('使用履歴取得エラー:', error);
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
