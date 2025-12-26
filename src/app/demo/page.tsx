'use client';

import { useState } from 'react';
import { Smartphone, ExternalLink, RotateCcw } from 'lucide-react';

export default function DemoPage() {
  const [key, setKey] = useState(0);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* ヘッダー */}
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
          <Smartphone className="w-4 h-4 text-purple-300" />
          <span className="text-sm font-medium text-purple-200">LINE Mini App Demo</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          クーポン機能 プロトタイプ
        </h1>
        <p className="text-purple-200/80">
          JAMES アパレルブランド向け LINEミニアプリ
        </p>
      </div>

      {/* iPhoneフレーム */}
      <div className="relative z-10">
        {/* デバイスシャドウ */}
        <div className="absolute inset-0 bg-black/50 blur-3xl scale-90 translate-y-8 rounded-[60px]" />
        
        {/* デバイス本体 */}
        <div className="relative bg-[#1a1a1a] rounded-[55px] p-3 shadow-2xl border border-gray-700/50">
          {/* サイドボタン（右側） */}
          <div className="absolute -right-[3px] top-32 w-[3px] h-12 bg-gray-700 rounded-l-sm" />
          <div className="absolute -right-[3px] top-48 w-[3px] h-24 bg-gray-700 rounded-l-sm" />
          
          {/* サイドボタン（左側） */}
          <div className="absolute -left-[3px] top-28 w-[3px] h-8 bg-gray-700 rounded-r-sm" />
          <div className="absolute -left-[3px] top-40 w-[3px] h-16 bg-gray-700 rounded-r-sm" />
          <div className="absolute -left-[3px] top-60 w-[3px] h-16 bg-gray-700 rounded-r-sm" />

          {/* スクリーンエリア */}
          <div className="relative bg-black rounded-[45px] overflow-hidden flex flex-col">
            {/* ダイナミックアイランド（Safe Area Top） */}
            <div className="flex-shrink-0 h-[50px] bg-white flex items-start justify-center pt-3">
              <div className="w-28 h-7 bg-black rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-gray-800 rounded-full mr-8" />
              </div>
            </div>

            {/* iframe コンテンツ */}
            <iframe
              key={key}
              src="/mini"
              className="w-[375px] h-[728px] border-0 bg-white flex-shrink-0"
              title="LINE Mini App Demo"
            />

            {/* ホームインジケーター（Safe Area Bottom） */}
            <div className="flex-shrink-0 h-[34px] bg-white flex items-center justify-center">
              <div className="w-32 h-1 bg-black/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* コントロール */}
      <div className="relative z-10 flex items-center gap-4 mt-8">
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">リフレッシュ</span>
        </button>
        <a
          href="/mini"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 text-white transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-sm">新規タブで開く</span>
        </a>
      </div>

      {/* フッター */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-sm text-purple-300/60">
          © 2025 JAMES Coupon Prototype
        </p>
      </div>
    </div>
  );
}

