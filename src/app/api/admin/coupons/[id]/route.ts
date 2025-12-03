import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseAdminConfigured } from '@/lib/supabase/server';
import { getMockCouponById } from '@/lib/mock/data';
import type { Database } from '@/lib/supabase/database.types';

type CouponRow = Database['public']['Tables']['coupons']['Row'];
type CouponUpdate = Database['public']['Tables']['coupons']['Update'];

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

// クーポン詳細取得
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Supabase未設定の場合はモックデータを返す
    if (!isSupabaseAdminConfigured) {
      const coupon = getMockCouponById(params.id);

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
        },
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'クーポンが見つかりませんでした',
        },
        { status: 404 }
      );
    }

    const dbCoupon = data as CouponRow;

    return NextResponse.json({
      success: true,
      coupon: {
        id: dbCoupon.id,
        title: dbCoupon.title,
        description: dbCoupon.description,
        imageUrl: dbCoupon.image_url,
        validFrom: dbCoupon.valid_from,
        validTo: dbCoupon.valid_to,
        isActive: dbCoupon.is_active,
        usageLimit: dbCoupon.usage_limit,
        createdAt: dbCoupon.created_at,
        updatedAt: dbCoupon.updated_at,
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

// クーポン更新
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();

    // Supabase未設定の場合はモックレスポンスを返す
    if (!isSupabaseAdminConfigured) {
      const existingCoupon = getMockCouponById(params.id);

      if (!existingCoupon) {
        return NextResponse.json(
          {
            success: false,
            error: 'NOT_FOUND',
            message: 'クーポンが見つかりませんでした',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        coupon: {
          id: params.id,
          title: body.title || existingCoupon.title,
          description: body.description ?? existingCoupon.description,
          imageUrl: body.imageUrl ?? existingCoupon.image_url,
          validFrom: body.validFrom || existingCoupon.valid_from,
          validTo: body.validTo || existingCoupon.valid_to,
          isActive: body.isActive ?? existingCoupon.is_active,
          usageLimit: body.usageLimit ?? existingCoupon.usage_limit,
          createdAt: existingCoupon.created_at,
          updatedAt: new Date().toISOString(),
        },
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { title, description, validFrom, validTo, usageLimit, isActive, imageUrl } =
      body;

    const updateData: CouponUpdate = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (validFrom !== undefined) updateData.valid_from = validFrom;
    if (validTo !== undefined) updateData.valid_to = validTo;
    if (usageLimit !== undefined) updateData.usage_limit = usageLimit;
    if (isActive !== undefined) updateData.is_active = isActive;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;

    const { data, error } = await supabase
      .from('coupons')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: 'NOT_FOUND',
          message: 'クーポンが見つかりませんでした',
        },
        { status: 404 }
      );
    }

    const updatedCoupon = data as CouponRow;

    return NextResponse.json({
      success: true,
      coupon: {
        id: updatedCoupon.id,
        title: updatedCoupon.title,
        description: updatedCoupon.description,
        imageUrl: updatedCoupon.image_url,
        validFrom: updatedCoupon.valid_from,
        validTo: updatedCoupon.valid_to,
        isActive: updatedCoupon.is_active,
        usageLimit: updatedCoupon.usage_limit,
        createdAt: updatedCoupon.created_at,
        updatedAt: updatedCoupon.updated_at,
      },
    });
  } catch (error) {
    console.error('クーポン更新エラー:', error);
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

// クーポン削除
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Supabase未設定の場合はモックレスポンスを返す
    if (!isSupabaseAdminConfigured) {
      return NextResponse.json({
        success: true,
        message: 'クーポンを削除しました（モックモード）',
      });
    }

    // Supabase接続時の処理
    const supabase = getClient();
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'クーポンを削除しました',
    });
  } catch (error) {
    console.error('クーポン削除エラー:', error);
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
