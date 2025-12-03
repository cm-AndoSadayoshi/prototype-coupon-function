'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // TODO: Supabase ログアウト処理
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader
        email="admin@beams.co.jp"
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      <div className="flex">
        {/* デスクトップサイドバー */}
        <div className="hidden lg:block">
          <AdminSidebar onLogout={handleLogout} />
        </div>

        {/* モバイルサイドバー（オーバーレイ） */}
        {sidebarOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="lg:hidden fixed inset-y-0 left-0 z-50">
              <AdminSidebar onLogout={handleLogout} />
            </div>
          </>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

