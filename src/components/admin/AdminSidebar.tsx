'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Ticket, Users, Settings, LogOut } from 'lucide-react';

const navItems = [
  {
    href: '/admin/dashboard',
    label: 'ダッシュボード',
    icon: BarChart3,
  },
  {
    href: '/admin/coupons',
    label: 'クーポン管理',
    icon: Ticket,
  },
  {
    href: '/admin/logs',
    label: '使用履歴',
    icon: Users,
  },
  {
    href: '/admin/settings',
    label: '設定',
    icon: Settings,
  },
];

interface AdminSidebarProps {
  onLogout?: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-beams-50 text-beams-700 font-semibold border-l-4 border-beams-500 -ml-1 pl-[19px]'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ログアウトボタン */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>ログアウト</span>
        </button>
      </div>
    </aside>
  );
}

