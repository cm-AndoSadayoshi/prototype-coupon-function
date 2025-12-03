'use client';

import { useState, useEffect } from 'react';
import { Ticket, TrendingUp, Users, Calendar } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { RealtimeUsageLog } from '@/components/admin/RealtimeUsageLog';
import type { UsageLog, DashboardStats } from '@/types/api';

// モックデータ
const mockStats: DashboardStats = {
  activeCoupons: 12,
  todayUsage: 8,
  totalUsage: 1234,
};

const mockLogs: UsageLog[] = [
  {
    id: '1',
    user: {
      id: 'U1234',
      displayName: '山田太郎',
      avatarUrl: null,
    },
    coupon: {
      id: 'c1',
      title: '全品10%OFF',
    },
    usedAt: new Date().toISOString(),
    status: 'used',
  },
  {
    id: '2',
    user: {
      id: 'U5678',
      displayName: '佐藤花子',
      avatarUrl: null,
    },
    coupon: {
      id: 'c2',
      title: '2点目半額',
    },
    usedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'used',
  },
  {
    id: '3',
    user: {
      id: 'U9012',
      displayName: '鈴木一郎',
      avatarUrl: null,
    },
    coupon: {
      id: 'c3',
      title: '3,000円OFF',
    },
    usedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    status: 'used',
  },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 実際のAPI呼び出しに置き換え
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStats(mockStats);
      setLogs(mockLogs);
      setLoading(false);
    };
    fetchData();

    // TODO: Supabase Realtimeの購読設定
    // const channel = supabase
    //   .channel('usage-logs')
    //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_coupons' }, (payload) => {
    //     setLogs(prev => [payload.new, ...prev].slice(0, 10));
    //   })
    //   .subscribe();

    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-8 bg-neutral-200 rounded w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-36 bg-neutral-200 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="h-96 bg-neutral-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ページタイトル */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">ダッシュボード</h1>
        <p className="text-sm text-neutral-500 mt-1">
          クーポンの利用状況をリアルタイムで確認できます
        </p>
      </div>

      {/* 統計カード */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-beams-500" />
          統計情報
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="発行中クーポン"
            value={stats?.activeCoupons || 0}
            unit="クーポン"
            icon={Ticket}
            iconBgColor="bg-beams-50"
            iconColor="text-beams-500"
            change={{ value: '+2', type: 'positive' }}
          />
          <StatsCard
            title="本日使用"
            value={stats?.todayUsage || 0}
            unit="件"
            icon={Calendar}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
            change={{ value: '今日', type: 'neutral' }}
          />
          <StatsCard
            title="総使用数"
            value={stats?.totalUsage || 0}
            unit="累計"
            icon={Users}
            iconBgColor="bg-purple-50"
            iconColor="text-purple-500"
          />
        </div>
      </div>

      {/* リアルタイム使用履歴 */}
      <RealtimeUsageLog logs={logs} />
    </div>
  );
}

