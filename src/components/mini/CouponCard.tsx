'use client';

import { motion } from 'framer-motion';
import { Calendar, Ticket, ChevronRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { CouponWithUserStatus } from '@/types/coupon';
import { formatDateShort, getDaysRemaining } from '@/lib/utils/date';

interface CouponCardProps {
  coupon: CouponWithUserStatus;
}

export function CouponCard({ coupon }: CouponCardProps) {
  const isUsed = coupon.userStatus.isUsed;
  const daysRemaining = getDaysRemaining(coupon.validTo);
  const isExpiringSoon = daysRemaining > 0 && daysRemaining <= 7;

  return (
    <Link href={`/mini/coupons/${coupon.id}`}>
      <motion.div
        whileHover={{ scale: isUsed ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          bg-white rounded-lg shadow-md hover:shadow-lg 
          transition-all duration-200 overflow-hidden 
          border cursor-pointer
          ${
            isUsed
              ? 'border-neutral-200 opacity-60'
              : 'border-neutral-100 hover:border-beams-200'
          }
        `}
      >
        {/* クーポン画像 */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-beams-50 to-beams-100">
          {coupon.imageUrl ? (
            <Image
              src={coupon.imageUrl}
              alt={coupon.title}
              fill
              className={`object-cover ${isUsed ? 'grayscale' : ''}`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Ticket className={`w-16 h-16 ${isUsed ? 'text-neutral-400' : 'text-beams-300'}`} />
            </div>
          )}

          {/* 使用済みバッジ */}
          {isUsed && (
            <div className="absolute top-4 right-4 bg-neutral-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <div className="flex items-center gap-1.5 text-white text-sm font-semibold">
                <Check className="w-4 h-4" />
                <span>使用済み</span>
              </div>
            </div>
          )}

          {/* 期限間近バッジ */}
          {!isUsed && isExpiringSoon && (
            <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-white text-xs font-semibold">
                あと{daysRemaining}日
              </span>
            </div>
          )}
        </div>

        {/* カード内容 */}
        <div className="p-5">
          {/* タイトル */}
          <h3 className="text-xl font-bold text-neutral-900 mb-2 line-clamp-2">
            {coupon.title}
          </h3>

          {/* ステータスバッジ */}
          {!isUsed && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-beams-50 border border-beams-200 mb-3">
              <Ticket className="w-3.5 h-3.5 text-beams-600" />
              <span className="text-xs font-semibold text-beams-700">
                利用可能
              </span>
            </div>
          )}

          {/* 有効期限 */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Calendar className="w-4 h-4" />
            <span>{formatDateShort(coupon.validTo)}まで</span>
          </div>

          {/* アクション */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-beams-500 font-semibold">
              {isUsed ? '詳細を見る' : '詳しく見る'}
            </span>
            <ChevronRight className="w-5 h-5 text-beams-500" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

