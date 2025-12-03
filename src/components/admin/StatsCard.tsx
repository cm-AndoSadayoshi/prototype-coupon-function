import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  change?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
}

export function StatsCard({
  title,
  value,
  unit,
  icon: Icon,
  iconBgColor = 'bg-beams-50',
  iconColor = 'text-beams-500',
  change,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-neutral-100 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <span
            className={`
              text-xs font-semibold px-2 py-1 rounded-full
              ${
                change.type === 'positive'
                  ? 'text-green-600 bg-green-50'
                  : change.type === 'negative'
                  ? 'text-red-600 bg-red-50'
                  : 'text-neutral-600 bg-neutral-50'
              }
            `}
          >
            {change.value}
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 mb-1">{title}</p>
      <p className={`text-3xl font-bold ${iconColor.replace('text-', 'text-')}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {unit && <p className="text-xs text-neutral-500 mt-2">{unit}</p>}
    </div>
  );
}

