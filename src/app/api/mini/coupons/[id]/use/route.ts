import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { getMockCouponById, getMockUserCouponUsage, addMockCouponUsage } from '@/lib/mock/data';
import type { Database } from '@/lib/supabase/database.types';

type CouponRow = Database['public']['Tables']['coupons']['Row'];
type UserCouponRow = Database['public']['Tables']['user_coupons']['Row'];

interface RouteParams {
  params: { id: string };
}

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

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const couponId = params.id;
    const userId = body.userId || 'mock-user';

    // Supabase未設定の場合はモックで処理
    if (!isSupabaseAdminConfigured) {
      const coupon = getMockCouponById(couponId);

      if (!coupon) {
        return NextResponse.json(
          {
            success: false,
            error: 'NOT_FOUND',
            message: 'クーポンが見つかりませんでした',
          },
          { status: 404 }
        );
      }

      // 有効期限チェック
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validTo = new Date(coupon.valid_to);

      if (now < validFrom || now > validTo) {
        return NextResponse.json(
          {
            success: false,
            error: 'EXPIRED',
            message: 'このクーポンは有効期限切れです',
          },
          { status: 400 }
        );
      }

      // アクティブチェック
      if (!coupon.is_active) {
        return NextResponse.json(
          {
            success: false,
            error: 'NOT_FOUND',
            message: 'このクーポンは現在利用できません',
          },
          { status: 400 }
        );
      }

      // 使用回数チェック
      const usedCount = getMockUserCouponUsage(userId, couponId).length;
      if (coupon.usage_limit > 0 && usedCount >= coupon.usage_limit) {
        return NextResponse.json(
          {
            success: false,
            error: 'ALREADY_USED',
            message: 'このクーポンは既に使用済みです',
          },
          { status: 400 }
        );
      }

      // クーポン使用を記録
      const userCoupon = addMockCouponUsage(userId, couponId);

      return NextResponse.json({
        success: true,
        userCoupon: {
          id: userCoupon.id,
          userId: userCoupon.user_id,
          couponId: userCoupon.coupon_id,
          usedAt: userCoupon.used_at,
          status: userCoupon.status,
        },
        message: 'クーポンを使用しました',
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { data: couponData, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', couponId)
      .single();

    if (couponError || !couponData) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'クーポンが見つかりませんでした',
        },
        { status: 404 }
      );
    }

    const coupon = couponData as CouponRow;

    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validTo = new Date(coupon.valid_to);

    if (now < validFrom || now > validTo) {
      return NextResponse.json(
        {
          success: false,
          error: 'EXPIRED',
          message: 'このクーポンは有効期限切れです',
        },
        { status: 400 }
      );
    }

    if (!coupon.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'このクーポンは現在利用できません',
        },
        { status: 400 }
      );
    }

    const { data: existingUsagesData } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('coupon_id', couponId)
      .eq('status', 'used');

    const existingUsages = (existingUsagesData || []) as UserCouponRow[];
    const usedCount = existingUsages.length;
    if (coupon.usage_limit > 0 && usedCount >= coupon.usage_limit) {
      return NextResponse.json(
        {
          success: false,
          error: 'ALREADY_USED',
          message: 'このクーポンは既に使用済みです',
        },
        { status: 400 }
      );
    }

    const { data: userCouponData, error: insertError } = await supabase
      .from('user_coupons')
      .insert({
        user_id: userId,
        coupon_id: couponId,
        used_at: now.toISOString(),
        status: 'used',
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const userCoupon = userCouponData as UserCouponRow;

    return NextResponse.json({
      success: true,
      userCoupon: {
        id: userCoupon.id,
        userId: userCoupon.user_id,
        couponId: userCoupon.coupon_id,
        usedAt: userCoupon.used_at,
        status: userCoupon.status,
      },
      message: 'クーポンを使用しました',
    });
  } catch (error) {
    console.error('クーポン使用エラー:', error);
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
