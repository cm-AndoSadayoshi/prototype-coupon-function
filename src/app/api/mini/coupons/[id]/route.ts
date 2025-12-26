import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { getMockCouponById, getMockUserCouponUsage } from '@/lib/mock/data';
import type { Database } from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'mock-user';
    const couponId = params.id;

    // Supabase未設定の場合はモックデータを返す
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

      const usedCount = getMockUserCouponUsage(userId, couponId).length;
      const isUsed = usedCount >= (coupon.usage_limit || 1);

      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validTo = new Date(coupon.valid_to);
      const isWithinPeriod = now >= validFrom && now <= validTo;

      return NextResponse.json({
        success: true,
        coupon: {
          id: coupon.id,
          title: coupon.title,
          description: coupon.description,
          imageUrl: coupon.image_url,
          validFrom: coupon.valid_from,
          validTo: coupon.valid_to,
          isActive: coupon.is_active,
          usageLimit: coupon.usage_limit,
          createdAt: coupon.created_at,
          updatedAt: coupon.updated_at,
          userStatus: {
            isUsed,
            usedCount,
            canUse: !isUsed && coupon.is_active && isWithinPeriod,
          },
        },
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

    const { data: userCouponsData } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('coupon_id', couponId);

    const userCoupons = (userCouponsData || []) as UserCouponRow[];
    const usedCount = userCoupons.filter((uc) => uc.status === 'used').length;
    const isUsed = usedCount >= (coupon.usage_limit || 1);

    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validTo = new Date(coupon.valid_to);
    const isWithinPeriod = now >= validFrom && now <= validTo;

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        title: coupon.title,
        description: coupon.description,
        imageUrl: coupon.image_url,
        validFrom: coupon.valid_from,
        validTo: coupon.valid_to,
        isActive: coupon.is_active,
        usageLimit: coupon.usage_limit,
        createdAt: coupon.created_at,
        updatedAt: coupon.updated_at,
        userStatus: {
          isUsed,
          usedCount,
          canUse: !isUsed && coupon.is_active && isWithinPeriod,
        },
      },
    });
  } catch (error) {
    console.error('クーポン詳細取得エラー:', error);
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
