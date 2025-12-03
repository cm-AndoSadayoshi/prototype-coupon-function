import { Ticket, Package } from 'lucide-react';

interface EmptyStateProps {
  type: 'available' | 'used';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'available') {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-20 h-20 bg-beams-50 rounded-full flex items-center justify-center mb-6">
          <Ticket className="w-10 h-10 text-beams-300" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">
          利用可能なクーポンがありません
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          新しいクーポンが発行されると
          <br />
          こちらに表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
        <Package className="w-10 h-10 text-neutral-400" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">
        使用済みのクーポンがありません
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed">
        クーポンを使用すると
        <br />
        こちらに履歴が表示されます
      </p>
    </div>
  );
}

