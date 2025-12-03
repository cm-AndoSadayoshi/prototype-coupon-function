'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Eye, MoreVertical, Ticket } from 'lucide-react';
import type { Coupon } from '@/types/coupon';
import { formatDateShort, isExpired, isWithinValidPeriod } from '@/lib/utils/date';

interface CouponTableProps {
  coupons: Coupon[];
  onDelete?: (id: string) => void;
}

export function CouponTable({ coupons, onDelete }: CouponTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.isActive) {
      return <span className="badge-secondary">非公開</span>;
    }
    if (isExpired(coupon.validTo)) {
      return <span className="badge-error">期限切れ</span>;
    }
    if (isWithinValidPeriod(coupon.validFrom, coupon.validTo)) {
      return <span className="badge-success">公開中</span>;
    }
    return <span className="badge-warning">予約中</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                クーポン
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                ステータス
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                有効期間
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                利用回数
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-neutral-700">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                  クーポンがありません
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  {/* クーポン情報 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                        {coupon.imageUrl ? (
                          <Image
                            src={coupon.imageUrl}
                            alt={coupon.title}
                            width={64}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 truncate">
                          {coupon.title}
                        </p>
                        <p className="text-sm text-neutral-500 truncate max-w-xs">
                          {coupon.description || '説明なし'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ステータス */}
                  <td className="px-6 py-4">{getStatusBadge(coupon)}</td>

                  {/* 有効期間 */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-neutral-700">
                      {formatDateShort(coupon.validFrom)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      〜 {formatDateShort(coupon.validTo)}
                    </p>
                  </td>

                  {/* 利用回数 */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-neutral-700">
                      {coupon.usageLimit === 0 ? '無制限' : `${coupon.usageLimit}回`}
                    </p>
                  </td>

                  {/* 操作 */}
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === coupon.id ? null : coupon.id)
                        }
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5 text-neutral-600" />
                      </button>

                      {/* ドロップダウンメニュー */}
                      {menuOpen === coupon.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setMenuOpen(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-neutral-200 z-20 py-1">
                            <Link
                              href={`/admin/coupons/${coupon.id}`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            >
                              <Eye className="w-4 h-4" />
                              詳細を見る
                            </Link>
                            <Link
                              href={`/admin/coupons/${coupon.id}/edit`}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            >
                              <Edit className="w-4 h-4" />
                              編集
                            </Link>
                            <button
                              onClick={() => {
                                setMenuOpen(null);
                                onDelete?.(coupon.id);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              削除
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

