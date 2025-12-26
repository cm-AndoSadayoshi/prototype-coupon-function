import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { mockCoupons, getMockUserCouponUsage } from '@/lib/mock/data';
import type { Database } from '@/lib/supabase/database.types';

export const dynamic = 'force-dynamic';

type CouponRow = Database['public']['Tables']['coupons']['Row'];
type UserCouponRow = Database['public']['Tables']['user_coupons']['Row'];

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
    const userId = searchParams.get('userId') || 'mock-user';
    const includeUsed = searchParams.get('includeUsed') === 'true';

    // Supabase未設定の場合はモックデータを返す
    if (!isSupabaseAdminConfigured) {
      const now = new Date();
      const activeCoupons = mockCoupons.filter((coupon) => {
        const validFrom = new Date(coupon.valid_from);
        const validTo = new Date(coupon.valid_to);
        return coupon.is_active && now >= validFrom && now <= validTo;
      });

      const couponsWithStatus = activeCoupons.map((coupon) => {
        const usedCount = getMockUserCouponUsage(userId, coupon.id).length;
        const isUsed = usedCount >= (coupon.usage_limit || 1);

        return {
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
            canUse: !isUsed && coupon.is_active,
          },
        };
      });

      const filteredCoupons = includeUsed
        ? couponsWithStatus
        : couponsWithStatus.filter((c) => !c.userStatus.isUsed);

      return NextResponse.json({
        success: true,
        coupons: filteredCoupons,
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const now = new Date().toISOString();
    const { data: couponsData, error: couponsError } = await supabase
      .from('coupons')
      .select('*')
      .eq('is_active', true)
      .lte('valid_from', now)
      .gte('valid_to', now)
      .order('created_at', { ascending: false });

    if (couponsError) throw couponsError;

    const { data: userCouponsData, error: userCouponsError } = await supabase
      .from('user_coupons')
      .select('*')
      .eq('user_id', userId);

    if (userCouponsError) throw userCouponsError;

    const coupons = (couponsData || []) as CouponRow[];
    const userCoupons = (userCouponsData || []) as UserCouponRow[];

    const couponsWithStatus = coupons.map((coupon) => {
      const userCouponRecords = userCoupons.filter(
        (uc) => uc.coupon_id === coupon.id
      );
      const usedCount = userCouponRecords.filter(
        (uc) => uc.status === 'used'
      ).length;
      const isUsed = usedCount >= (coupon.usage_limit || 1);

      return {
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
          canUse: !isUsed && coupon.is_active,
        },
      };
    });

    const filteredCoupons = includeUsed
      ? couponsWithStatus
      : couponsWithStatus.filter((c) => !c.userStatus.isUsed);

    return NextResponse.json({
      success: true,
      coupons: filteredCoupons,
    });
  } catch (error) {
    console.error('クーポン一覧取得エラー:', error);
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
