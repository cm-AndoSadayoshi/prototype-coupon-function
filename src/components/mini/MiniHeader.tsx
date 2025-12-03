'use client';

import { Menu, User } from 'lucide-react';
import Image from 'next/image';

interface MiniHeaderProps {
  title?: string;
  userAvatarUrl?: string | null;
  userName?: string | null;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
}

export function MiniHeader({
  title = 'クーポン',
  userAvatarUrl,
  userName,
  onMenuClick,
  onProfileClick,
}: MiniHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm safe-top">
      <div className="flex items-center justify-between px-4 py-3">
        {/* メニューボタン */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg transition-colors"
          aria-label="メニューを開く"
        >
          <Menu className="w-6 h-6 text-neutral-900" />
        </button>

        {/* タイトル */}
        <h1 className="text-lg font-bold text-neutral-900">{title}</h1>

        {/* プロフィール */}
        <button
          onClick={onProfileClick}
          className="p-1 -mr-1 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="プロフィール"
        >
          {userAvatarUrl ? (
            <Image
              src={userAvatarUrl}
              alt={userName || 'ユーザー'}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-600" />
            </div>
          )}
        </button>
      </div>
    </header>
  );
}

