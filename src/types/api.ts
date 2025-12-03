import { Coupon, CouponWithUserStatus, UserCoupon } from './coupon';
import { User } from './user';

// 共通レスポンス型
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// エラーコード
export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'ALREADY_USED'
  | 'EXPIRED'
  | 'NOT_FOUND'
  | 'INVALID_INPUT'
  | 'SERVER_ERROR'
  | 'USAGE_LIMIT_EXCEEDED';

// エラーレスポンス
export interface ApiErrorResponse {
  success: false;
  error: ErrorCode;
  message: string;
}

// ユーザー登録レスポンス
export interface RegisterResponse {
  success: boolean;
  user: User;
  isNewUser: boolean;
}

// クーポン一覧レスポンス
export interface CouponsListResponse {
  success: boolean;
  coupons: CouponWithUserStatus[];
}

// クーポン詳細レスポンス
export interface CouponDetailResponse {
  success: boolean;
  coupon: CouponWithUserStatus;
}

// クーポン使用レスポンス
export interface CouponUseResponse {
  success: boolean;
  userCoupon: UserCoupon;
  message: string;
}

// 使用履歴レスポンス
export interface UsageLog {
  id: string;
  user: {
    id: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  coupon: {
    id: string;
    title: string;
  };
  usedAt: string;
  status: 'used' | 'unused';
}

export interface UsageLogsResponse {
  success: boolean;
  logs: UsageLog[];
  total: number;
  limit: number;
  offset: number;
}

// クーポン作成レスポンス
export interface CouponCreateResponse {
  success: boolean;
  coupon: Coupon;
}

// 画像アップロードレスポンス
export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
}

// ダッシュボード統計
export interface DashboardStats {
  activeCoupons: number;
  todayUsage: number;
  totalUsage: number;
}

