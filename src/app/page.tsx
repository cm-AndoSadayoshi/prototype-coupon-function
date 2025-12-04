import Link from 'next/link';
import { Ticket, Settings, Smartphone, Monitor } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beams-50 via-white to-beams-100">
      {/* ヘッダー */}
      <header className="py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-12 h-12 bg-beams-500 rounded-xl flex items-center justify-center shadow-beams">
            <span className="text-white font-bold text-2xl">J</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">JAMES クーポン</h1>
            <p className="text-sm text-neutral-500">プロトタイプ</p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* ヒーローセクション */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-beams-500 rounded-3xl mb-6 shadow-lg shadow-beams-500/30">
              <Ticket className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              LINEミニアプリ
              <br />
              <span className="text-gradient-beams">クーポン機能</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
              JAMESブランドをイメージした洗練されたデザインで、
              お客様に快適なクーポン体験を提供します
            </p>
          </div>

          {/* アプリリンク */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* ミニアプリ */}
            <Link
              href="/mini"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-neutral-100 hover:border-beams-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-beams-50 rounded-xl flex items-center justify-center group-hover:bg-beams-100 transition-colors">
                  <Smartphone className="w-7 h-7 text-beams-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">ミニアプリ</h3>
                  <p className="text-sm text-neutral-500">ユーザー向け画面</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                クーポン一覧の閲覧、詳細確認、
                もぎり（使用）機能をお試しいただけます
              </p>
              <div className="flex items-center gap-2 text-beams-500 font-semibold">
                <span>アプリを開く</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* 管理画面 */}
            <Link
              href="/admin/dashboard"
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-neutral-100 hover:border-beams-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-neutral-100 rounded-xl flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
                  <Monitor className="w-7 h-7 text-neutral-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">管理画面</h3>
                  <p className="text-sm text-neutral-500">スタッフ向け画面</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                クーポンの作成・編集・削除、
                使用履歴のリアルタイム確認ができます
              </p>
              <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                <span>管理画面を開く</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          </div>

          {/* 機能概要 */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg border border-neutral-100 p-8">
            <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-beams-500" />
              主な機能
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900">ミニアプリ（ユーザー）</h4>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-beams-500 rounded-full" />
                    クーポン一覧表示（利用可能/使用済み）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-beams-500 rounded-full" />
                    クーポン詳細確認
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-beams-500 rounded-full" />
                    もぎりアニメーション付きクーポン使用
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-neutral-900">管理画面（スタッフ）</h4>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-beams-500 rounded-full" />
                    ダッシュボード（統計情報）
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-beams-500 rounded-full" />
                    クーポンCRUD操作
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-beams-500 rounded-full" />
                    リアルタイム使用履歴
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="py-8 px-4 text-center">
        <p className="text-sm text-neutral-500">
          © 2025 JAMES Coupon Prototype
        </p>
      </footer>
    </div>
  );
}

