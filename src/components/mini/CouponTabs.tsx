'use client';

import { Ticket, Check } from 'lucide-react';

export type TabValue = 'available' | 'used';

interface CouponTabsProps {
  activeTab: TabValue;
  onChange: (tab: TabValue) => void;
  availableCount?: number;
  usedCount?: number;
}

export function CouponTabs({
  activeTab,
  onChange,
  availableCount,
  usedCount,
}: CouponTabsProps) {
  return (
    <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
      <button
        onClick={() => onChange('available')}
        className={`
          flex-1 flex items-center justify-center gap-2 
          py-2.5 px-4 rounded-md font-semibold text-sm
          transition-all duration-200
          ${
            activeTab === 'available'
              ? 'bg-white text-beams-600 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }
        `}
      >
        <Ticket className="w-4 h-4" />
        <span>利用可能</span>
        {typeof availableCount === 'number' && (
          <span
            className={`
              min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
              flex items-center justify-center
              ${
                activeTab === 'available'
                  ? 'bg-beams-500 text-white'
                  : 'bg-neutral-300 text-neutral-600'
              }
            `}
          >
            {availableCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onChange('used')}
        className={`
          flex-1 flex items-center justify-center gap-2 
          py-2.5 px-4 rounded-md font-semibold text-sm
          transition-all duration-200
          ${
            activeTab === 'used'
              ? 'bg-white text-beams-600 shadow-sm'
              : 'text-neutral-600 hover:text-neutral-900'
          }
        `}
      >
        <Check className="w-4 h-4" />
        <span>使用済み</span>
        {typeof usedCount === 'number' && (
          <span
            className={`
              min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold
              flex items-center justify-center
              ${
                activeTab === 'used'
                  ? 'bg-beams-500 text-white'
                  : 'bg-neutral-300 text-neutral-600'
              }
            `}
          >
            {usedCount}
          </span>
        )}
      </button>
    </div>
  );
}

