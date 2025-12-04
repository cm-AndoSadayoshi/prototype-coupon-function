'use client';

import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MiniHeader } from '@/components/mini/MiniHeader';
import { CouponTabs, TabValue } from '@/components/mini/CouponTabs';
import { CouponCard } from '@/components/mini/CouponCard';
import { CouponListSkeleton } from '@/components/mini/CouponCardSkeleton';
import { EmptyState } from '@/components/mini/EmptyState';
import type { CouponWithUserStatus } from '@/types/coupon';

// モックデータ（開発用）
const mockCoupons: CouponWithUserStatus[] = [
  {
    id: '1',
    title: '全品10%OFF',
    description: '店内全商品が10%割引でお買い求めいただけます。一部商品を除く。',
    imageUrl: '/images/coupons/coupon-10off.jpg',
    validFrom: '2025-12-01T00:00:00Z',
    validTo: '2025-12-31T23:59:59Z',
    isActive: true,
    usageLimit: 1,
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
    userStatus: {
      isUsed: false,
      usedCount: 0,
      canUse: true,
    },
  },
  {
    id: '2',
    title: '2点目半額キャンペーン',
    description: '2点以上お買い上げで2点目が50%OFF！',
    imageUrl: '/images/coupons/coupon-half.jpg',
    validFrom: '2025-12-01T00:00:00Z',
    validTo: '2025-12-10T23:59:59Z',
    isActive: true,
    usageLimit: 1,
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
    userStatus: {
      isUsed: false,
      usedCount: 0,
      canUse: true,
    },
  },
  {
    id: '3',
    title: '3,000円OFF',
    description: '10,000円以上のお買い上げで3,000円割引',
    imageUrl: '/images/coupons/coupon-3000off.jpg',
    validFrom: '2025-11-01T00:00:00Z',
    validTo: '2025-11-30T23:59:59Z',
    isActive: true,
    usageLimit: 1,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
    userStatus: {
      isUsed: true,
      usedCount: 1,
      canUse: false,
    },
  },
];

export default function MiniCouponListPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('available');
  const [coupons, setCoupons] = useState<CouponWithUserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCoupons = useCallback(async () => {
    try {
      setError(null);
      // TODO: 実際のAPI呼び出しに置き換え
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCoupons(mockCoupons);
    } catch (err) {
      setError('クーポンの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCoupons();
  };

  // タブでフィルタリング
  const availableCoupons = coupons.filter((c) => !c.userStatus.isUsed);
  const usedCoupons = coupons.filter((c) => c.userStatus.isUsed);
  const displayedCoupons = activeTab === 'available' ? availableCoupons : usedCoupons;

  return (
    <div className="min-h-screen bg-neutral-50">
      <MiniHeader title="クーポン" />

      <main className="px-4 py-6 space-y-6">
        {/* リフレッシュボタン */}
        <div className="flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>更新</span>
          </button>
        </div>

        {/* タブ */}
        <CouponTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          availableCount={availableCoupons.length}
          usedCount={usedCoupons.length}
        />

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="text-sm text-red-600 hover:text-red-700 underline mt-1"
                >
                  再試行
                </button>
              </div>
            </div>
          </div>
        )}

        {/* クーポンリスト */}
        {loading ? (
          <CouponListSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {displayedCoupons.length === 0 ? (
                <EmptyState type={activeTab} />
              ) : (
                displayedCoupons.map((coupon, index) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CouponCard coupon={coupon} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

