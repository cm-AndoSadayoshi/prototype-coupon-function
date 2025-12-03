'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, User } from 'lucide-react';
import Image from 'next/image';
import type { UsageLog } from '@/types/api';
import { formatDateTime, getRelativeTime } from '@/lib/utils/date';

// モックデータ
const mockLogs: UsageLog[] = [
  {
    id: '1',
    user: { id: 'U1234', displayName: '山田太郎', avatarUrl: null },
    coupon: { id: 'c1', title: '全品10%OFF' },
    usedAt: new Date().toISOString(),
    status: 'used',
  },
  {
    id: '2',
    user: { id: 'U5678', displayName: '佐藤花子', avatarUrl: null },
    coupon: { id: 'c2', title: '2点目半額' },
    usedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'used',
  },
  {
    id: '3',
    user: { id: 'U9012', displayName: '鈴木一郎', avatarUrl: null },
    coupon: { id: 'c3', title: '3,000円OFF' },
    usedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'used',
  },
  {
    id: '4',
    user: { id: 'U3456', displayName: '田中美咲', avatarUrl: null },
    coupon: { id: 'c1', title: '全品10%OFF' },
    usedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'used',
  },
];

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLogs(mockLogs);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.coupon.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">使用履歴</h1>
          <p className="text-sm text-neutral-500 mt-1">
            クーポンの使用履歴を確認できます
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
          <Download className="w-5 h-5 text-neutral-600" />
          <span className="text-neutral-700 font-medium">エクスポート</span>
        </button>
      </div>

      {/* 検索・フィルター */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="ユーザー名またはクーポン名で検索..."
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

      {/* 使用履歴テーブル */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                  ユーザー
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                  クーポン
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                  使用日時
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-neutral-700">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="h-12 bg-neutral-200 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    使用履歴がありません
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                    {/* ユーザー */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                          {log.user.avatarUrl ? (
                            <Image
                              src={log.user.avatarUrl}
                              alt={log.user.displayName || ''}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-neutral-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {log.user.displayName || '名前なし'}
                          </p>
                          <p className="text-xs text-neutral-500">{log.user.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* クーポン */}
                    <td className="px-6 py-4">
                      <p className="text-neutral-900">{log.coupon.title}</p>
                    </td>

                    {/* 使用日時 */}
                    <td className="px-6 py-4">
                      <p className="text-neutral-900">{formatDateTime(log.usedAt)}</p>
                      <p className="text-xs text-neutral-500">
                        {getRelativeTime(log.usedAt)}
                      </p>
                    </td>

                    {/* ステータス */}
                    <td className="px-6 py-4">
                      <span className="badge-success">使用済み</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 統計 */}
      <div className="flex items-center justify-between text-sm text-neutral-500">
        <p>{filteredLogs.length}件の履歴</p>
      </div>
    </div>
  );
}

