import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { mockCoupons } from '@/lib/mock/data';
import { CouponSchema } from '@/lib/utils/validation';
import type { Database } from '@/lib/supabase/database.types';

type CouponRow = Database['public']['Tables']['coupons']['Row'];

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

// クーポン一覧取得
export async function GET() {
  try {
    // Supabase未設定の場合はモックデータを返す
    if (!isSupabaseAdminConfigured) {
      return NextResponse.json({
        success: true,
        coupons: mockCoupons.map((coupon) => ({
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
        })),
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const coupons = (data || []) as CouponRow[];

    return NextResponse.json({
      success: true,
      coupons: coupons.map((coupon) => ({
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
      })),
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

// クーポン作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validationResult = CouponSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'INVALID_INPUT',
          message: validationResult.error.errors[0]?.message || '入力内容に誤りがあります',
        },
        { status: 400 }
      );
    }

    const { title, description, validFrom, validTo, usageLimit, isActive } =
      validationResult.data;

    // Supabase未設定の場合はモックレスポンスを返す
    if (!isSupabaseAdminConfigured) {
      const mockCoupon = {
        id: `mock-${Date.now()}`,
        title,
        description,
        imageUrl: null,
        validFrom,
        validTo,
        isActive,
        usageLimit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json(
        {
          success: true,
          coupon: mockCoupon,
        },
        { status: 201 }
      );
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { data, error } = await supabase
      .from('coupons')
      .insert({
        title,
        description,
        valid_from: validFrom,
        valid_to: validTo,
        usage_limit: usageLimit,
        is_active: isActive,
      })
      .select()
      .single();

    if (error) throw error;

    const coupon = data as CouponRow;

    return NextResponse.json(
      {
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
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('クーポン作成エラー:', error);
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
