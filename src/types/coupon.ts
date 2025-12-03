export interface Coupon {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface CouponWithUserStatus extends Coupon {
  userStatus: {
    isUsed: boolean;
    usedCount: number;
    canUse: boolean;
  };
}

export interface UserCoupon {
  id: string;
  userId: string;
  couponId: string;
  usedAt: string | null;
  status: 'used' | 'unused';
  createdAt: string;
}

export interface CouponCreateInput {
  title: string;
  description?: string;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  isActive: boolean;
}

export interface CouponUpdateInput extends Partial<CouponCreateInput> {
  imageUrl?: string;
}

