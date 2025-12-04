'use client';

import { Menu, Bell, User } from 'lucide-react';

interface AdminHeaderProps {
  email?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export function AdminHeader({ email, onMenuClick, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左側 */}
          <div className="flex items-center gap-4">
            {/* モバイルメニューボタン */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-neutral-900" />
            </button>

            {/* ロゴ */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-beams-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  JAMES クーポン管理
                </h1>
                <p className="text-sm text-neutral-500 hidden sm:block">
                  管理画面
                </p>
              </div>
            </div>
          </div>

          {/* 右側 */}
          <div className="flex items-center gap-4">
            {/* 通知ボタン */}
            <button className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-neutral-600" />
              {/* 通知バッジ */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* ユーザー情報 */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-neutral-600" />
              </div>
              <span className="text-sm text-neutral-600">{email}</span>
            </div>

            {/* ログアウトボタン */}
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

