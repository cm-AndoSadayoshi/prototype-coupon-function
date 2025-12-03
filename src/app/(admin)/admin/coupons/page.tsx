'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter } from 'lucide-react';
import { CouponTable } from '@/components/admin/CouponTable';
import type { Coupon } from '@/types/coupon';

// モックデータ
const mockCoupons: Coupon[] = [
  {
    id: '1',
    title: '全品10%OFF',
    description: '店内全商品が10%割引でお買い求めいただけます。',
    imageUrl: null,
    validFrom: '2025-12-01T00:00:00Z',
    validTo: '2025-12-31T23:59:59Z',
    isActive: true,
    usageLimit: 1,
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: '2',
    title: '2点目半額キャンペーン',
    description: '2点以上お買い上げで2点目が50%OFF！',
    imageUrl: null,
    validFrom: '2025-12-01T00:00:00Z',
    validTo: '2025-12-10T23:59:59Z',
    isActive: true,
    usageLimit: 1,
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2025-12-01T00:00:00Z',
  },
  {
    id: '3',
    title: '3,000円OFF',
    description: '10,000円以上のお買い上げで3,000円割引',
    imageUrl: null,
    validFrom: '2025-11-01T00:00:00Z',
    validTo: '2025-11-30T23:59:59Z',
    isActive: false,
    usageLimit: 1,
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2025-11-01T00:00:00Z',
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: 実際のAPI呼び出しに置き換え
    const fetchCoupons = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCoupons(mockCoupons);
      setLoading(false);
    };
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('このクーポンを削除してもよろしいですか？')) return;

    // TODO: 実際のAPI呼び出し
    setCoupons(coupons.filter((c) => c.id !== id));
  };

  const filteredCoupons = coupons.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">クーポン管理</h1>
          <p className="text-sm text-neutral-500 mt-1">
            クーポンの作成・編集・削除ができます
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center justify-center gap-2 bg-beams-500 hover:bg-beams-600 text-white font-semibold px-6 py-3 rounded-lg shadow-beams hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          新規作成
        </Link>
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="クーポンを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
          <Filter className="w-5 h-5 text-neutral-600" />
          <span className="text-neutral-700 font-medium">フィルター</span>
        </button>
      </div>

      {/* クーポン一覧 */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md border border-neutral-100 p-8">
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-neutral-200 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <CouponTable coupons={filteredCoupons} onDelete={handleDelete} />

          {/* 統計 */}
          <div className="flex items-center justify-between text-sm text-neutral-500">
            <p>{filteredCoupons.length}件のクーポン</p>
          </div>
        </>
      )}
    </div>
  );
}

