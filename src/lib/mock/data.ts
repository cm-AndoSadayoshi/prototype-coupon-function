// モックデータ（Supabase未設定時に使用）

export const mockCoupons = [
  {
    id: '1',
    title: '全品10%OFF',
    description: '店内全商品が10%割引でお買い求めいただけます。一部商品（アクセサリー、セール品）を除きます。',
    image_url: '/images/coupons/coupon-10off.jpg',
    valid_from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    usage_limit: 1,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: '2点目半額キャンペーン',
    description: '2点以上お買い上げで2点目が50%OFF！コーディネート買いにおすすめです。',
    image_url: '/images/coupons/coupon-half.jpg',
    valid_from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    valid_to: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    usage_limit: 1,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: '3,000円OFF',
    description: '10,000円以上のお買い上げで3,000円割引。高品質なアイテムをお得にゲット！',
    image_url: '/images/coupons/coupon-3000off.jpg',
    valid_from: new Date().toISOString(),
    valid_to: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    usage_limit: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: '送料無料クーポン',
    description: 'オンラインストアでのお買い物が送料無料になります。',
    image_url: '/images/coupons/coupon-shipping.jpg',
    valid_from: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    valid_to: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    usage_limit: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: '会員限定20%OFF（終了）',
    description: 'LINE友だち限定！店内全商品が20%割引でお買い求めいただけます。',
    image_url: '/images/coupons/coupon-member.jpg',
    valid_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    valid_to: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: false,
    usage_limit: 1,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockUsers = [
  {
    id: 'U0000000000000001',
    display_name: 'テストユーザー1',
    avatar_url: null,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_login_at: new Date().toISOString(),
  },
  {
    id: 'U0000000000000002',
    display_name: 'テストユーザー2',
    avatar_url: null,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_login_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// モック使用履歴（メモリ内で管理）
export const mockUserCoupons: Array<{
  id: string;
  user_id: string;
  coupon_id: string;
  used_at: string | null;
  status: 'used' | 'unused';
  created_at: string;
}> = [
  {
    id: 'uc1',
    user_id: 'U0000000000000001',
    coupon_id: '5', // 終了したクーポン
    used_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'used',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockUsageLogs = [
  {
    id: '1',
    user_id: 'U0000000000000001',
    coupon_id: '1',
    used_at: new Date().toISOString(),
    status: 'used' as const,
    user: {
      id: 'U0000000000000001',
      display_name: '山田太郎',
      avatar_url: null,
    },
    coupon: {
      id: '1',
      title: '全品10%OFF',
    },
  },
  {
    id: '2',
    user_id: 'U0000000000000002',
    coupon_id: '2',
    used_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'used' as const,
    user: {
      id: 'U0000000000000002',
      display_name: '佐藤花子',
      avatar_url: null,
    },
    coupon: {
      id: '2',
      title: '2点目半額',
    },
  },
  {
    id: '3',
    user_id: 'U0000000000000001',
    coupon_id: '3',
    used_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'used' as const,
    user: {
      id: 'U0000000000000001',
      display_name: '鈴木一郎',
      avatar_url: null,
    },
    coupon: {
      id: '3',
      title: '3,000円OFF',
    },
  },
];

// ヘルパー関数
export function getMockCouponById(id: string) {
  return mockCoupons.find((c) => c.id === id);
}

export function getMockUserCouponUsage(userId: string, couponId: string) {
  return mockUserCoupons.filter(
    (uc) => uc.user_id === userId && uc.coupon_id === couponId && uc.status === 'used'
  );
}

export function addMockCouponUsage(userId: string, couponId: string) {
  const newUsage = {
    id: `uc${Date.now()}`,
    user_id: userId,
    coupon_id: couponId,
    used_at: new Date().toISOString(),
    status: 'used' as const,
    created_at: new Date().toISOString(),
  };
  mockUserCoupons.push(newUsage);
  return newUsage;
}

