export function CouponCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-100 overflow-hidden animate-pulse">
      {/* 画像プレースホルダー */}
      <div className="aspect-[16/9] bg-neutral-200" />

      {/* コンテンツプレースホルダー */}
      <div className="p-5 space-y-4">
        {/* タイトル */}
        <div className="h-6 bg-neutral-200 rounded w-3/4" />

        {/* バッジ */}
        <div className="h-6 bg-neutral-200 rounded-full w-24" />

        {/* 日付 */}
        <div className="h-4 bg-neutral-200 rounded w-1/2" />

        {/* アクション */}
        <div className="flex justify-between items-center">
          <div className="h-4 bg-neutral-200 rounded w-20" />
          <div className="h-5 w-5 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function CouponListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <CouponCardSkeleton key={i} />
      ))}
    </div>
  );
}

