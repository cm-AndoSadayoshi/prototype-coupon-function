'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  MoreVertical,
  Calendar,
  AlertCircle,
  Ticket,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MogiriModal } from '@/components/mini/MogiriModal';
import { MogiriAnimation } from '@/components/mini/MogiriAnimation';
import type { CouponWithUserStatus } from '@/types/coupon';
import { formatDate, getDaysRemaining } from '@/lib/utils/date';

// モックデータ（開発用）
const mockCoupon: CouponWithUserStatus = {
  id: '1',
  title: '全品10%OFF',
  description:
    '店内全商品が10%割引でお買い求めいただけます。一部商品（アクセサリー、セール品）を除きます。この機会にぜひBEAMSでお買い物をお楽しみください。',
  imageUrl: null,
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
};

interface PageProps {
  params: { id: string };
}

export default function CouponDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [coupon, setCoupon] = useState<CouponWithUserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCoupon = useCallback(async () => {
    try {
      setError(null);
      // TODO: 実際のAPI呼び出しに置き換え
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCoupon(mockCoupon);
    } catch (err) {
      setError('クーポンの取得に失敗しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupon();
  }, [fetchCoupon]);

  const handleUseCoupon = async () => {
    if (!coupon) return;

    setIsProcessing(true);
    try {
      // TODO: 実際のAPI呼び出しに置き換え
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowModal(false);
      setShowAnimation(true);
    } catch (err) {
      setError('クーポンの使用に失敗しました');
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleAnimationComplete = () => {
    setTimeout(() => {
      router.push('/mini');
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="animate-pulse">
          <div className="aspect-[16/9] bg-neutral-200" />
          <div className="px-4 py-6 space-y-4">
            <div className="h-8 bg-neutral-200 rounded w-24" />
            <div className="h-10 bg-neutral-200 rounded w-3/4" />
            <div className="h-20 bg-neutral-200 rounded" />
            <div className="h-24 bg-neutral-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-neutral-600 mb-6">{error || 'クーポンが見つかりません'}</p>
          <Link
            href="/mini"
            className="inline-flex items-center gap-2 text-beams-500 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  const isUsed = coupon.userStatus.isUsed;
  const daysRemaining = getDaysRemaining(coupon.validTo);

  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        {/* ヘッダー */}
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href="/mini"
              className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-900" />
            </Link>
            <h1 className="text-lg font-bold text-neutral-900">クーポン詳細</h1>
            <button className="p-2 -mr-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <MoreVertical className="w-6 h-6 text-neutral-900" />
            </button>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="pb-32">
          {/* クーポン画像 */}
          <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-beams-50 to-beams-100">
            {coupon.imageUrl ? (
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Image
                  src={coupon.imageUrl}
                  alt={coupon.title}
                  fill
                  className={`object-cover ${isUsed ? 'grayscale' : ''}`}
                  priority
                />
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Ticket
                  className={`w-24 h-24 ${isUsed ? 'text-neutral-400' : 'text-beams-300'}`}
                />
              </div>
            )}
            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />

            {/* 使用済みオーバーレイ */}
            {isUsed && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="bg-neutral-900/90 backdrop-blur-sm px-6 py-3 rounded-full">
                  <div className="flex items-center gap-2 text-white text-lg font-bold">
                    <Check className="w-6 h-6" />
                    <span>使用済み</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-4 py-6 space-y-6">
            {/* ステータスバッジ */}
            {!isUsed && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-beams-50 border-2 border-beams-200 rounded-full">
                  <Ticket className="w-5 h-5 text-beams-600" />
                  <span className="text-sm font-bold text-beams-700">利用可能</span>
                </div>
              </motion.div>
            )}

            {/* タイトル */}
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-neutral-900 leading-tight"
            >
              {coupon.title}
            </motion.h2>

            {/* 説明文 */}
            {coupon.description && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base text-neutral-700 leading-relaxed"
              >
                {coupon.description}
              </motion.p>
            )}

            {/* 有効期限カード */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-50 rounded-xl p-5 border border-neutral-200"
            >
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-beams-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900 mb-1">
                    有効期限
                  </p>
                  <p className="text-base text-neutral-700">
                    {formatDate(coupon.validTo)} 23:59まで
                  </p>
                  {!isUsed && daysRemaining > 0 && daysRemaining <= 7 && (
                    <p className="text-sm text-amber-600 font-semibold mt-1">
                      あと{daysRemaining}日で有効期限切れ
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* 注意事項 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-neutral-600" />
                <h3 className="text-lg font-bold text-neutral-900">
                  ご利用上の注意
                </h3>
              </div>
              <ul className="space-y-2 pl-7">
                <li className="text-sm text-neutral-600 leading-relaxed">
                  • 他のクーポンとの併用はできません
                </li>
                <li className="text-sm text-neutral-600 leading-relaxed">
                  • お会計前にスタッフへご提示ください
                </li>
                <li className="text-sm text-neutral-600 leading-relaxed">
                  • 一部対象外商品がございます
                </li>
                <li className="text-sm text-neutral-600 leading-relaxed">
                  • このクーポンは1回限り有効です
                </li>
              </ul>
            </motion.div>
          </div>
        </main>

        {/* 固定CTAボタン */}
        {!isUsed && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-lg safe-bottom">
            <button
              onClick={() => setShowModal(true)}
              className="
                w-full flex items-center justify-center gap-2
                bg-beams-500 hover:bg-beams-600 active:bg-beams-700
                text-white font-bold text-lg
                px-6 py-4 rounded-xl
                shadow-beams hover:shadow-lg
                transition-all duration-200
                transform active:scale-98
              "
            >
              <Ticket className="w-6 h-6" />
              <span>クーポンを利用する</span>
            </button>
          </div>
        )}
      </div>

      {/* もぎり確認モーダル */}
      <MogiriModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleUseCoupon}
        couponTitle={coupon.title}
        isLoading={isProcessing}
      />

      {/* もぎりアニメーション */}
      <AnimatePresence>
        {showAnimation && (
          <MogiriAnimation
            couponImage={coupon.imageUrl}
            onComplete={handleAnimationComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

