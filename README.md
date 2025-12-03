# BEAMS クーポンアプリ プロトタイプ

LINEミニアプリ「クーポン機能」のプロトタイプです。BEAMSブランドをイメージした洗練されたデザインで、お客様に快適なクーポン体験を提供します。

## 🎨 デザインコンセプト

- **メインカラー:** BEAMSオレンジ (#FF6600)
- **フォント:** Inter + Noto Sans JP
- **スタイル:** ミニマル、クリーン、モダン
- **アニメーション:** Framer Motion による滑らかな動き

## 🚀 技術スタック

| レイヤー | 技術 | バージョン |
|---------|------|-----------|
| Frontend Framework | Next.js | 14.x (App Router) |
| UI Library | React | 18.x |
| スタイリング | Tailwind CSS | 3.x |
| アニメーション | Framer Motion | 11.x |
| LINE SDK | LIFF SDK | 2.24.x |
| バックエンド | Supabase | Latest |
| ホスティング | Vercel | Latest |

## 📁 プロジェクト構成

```
src/
├── app/
│   ├── (mini)/              # ミニアプリ (LIFF)
│   │   └── mini/
│   │       ├── page.tsx     # クーポン一覧
│   │       └── coupons/
│   │           └── [id]/
│   │               └── page.tsx  # クーポン詳細・もぎり
│   ├── (admin)/             # 管理画面
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── coupons/
│   │       ├── logs/
│   │       └── login/
│   ├── api/                 # API Routes
│   │   ├── mini/           # ミニアプリAPI
│   │   └── admin/          # 管理画面API
│   ├── layout.tsx
│   └── page.tsx            # ランディングページ
├── components/
│   ├── mini/               # ミニアプリコンポーネント
│   └── admin/              # 管理画面コンポーネント
├── lib/
│   ├── supabase/           # Supabaseクライアント
│   ├── liff/               # LIFF初期化
│   └── utils/              # ユーティリティ
└── types/                  # 型定義
```

## 🛠️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# LIFF
NEXT_PUBLIC_LIFF_ID=1234567890-abcdefgh

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. データベースのセットアップ

Supabase のSQL Editorで `supabase/schema.sql` を実行してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 📱 主な機能

### ミニアプリ（ユーザー向け）

- **クーポン一覧:** 利用可能/使用済みのタブ切り替え
- **クーポン詳細:** 詳細情報と注意事項の表示
- **もぎり機能:** アニメーション付きのクーポン使用

### 管理画面（スタッフ向け）

- **ダッシュボード:** 統計情報とリアルタイム使用履歴
- **クーポン管理:** 作成・編集・削除
- **使用履歴:** 全履歴の確認とエクスポート

## 🔗 API エンドポイント

### ミニアプリAPI

| エンドポイント | メソッド | 説明 |
|------------|---------|------|
| `/api/mini/auth/register` | POST | ユーザー登録・ログイン |
| `/api/mini/coupons` | GET | クーポン一覧取得 |
| `/api/mini/coupons/:id` | GET | クーポン詳細取得 |
| `/api/mini/coupons/:id/use` | POST | クーポン使用 |

### 管理画面API

| エンドポイント | メソッド | 説明 |
|------------|---------|------|
| `/api/admin/coupons` | GET | 全クーポン一覧取得 |
| `/api/admin/coupons` | POST | クーポン作成 |
| `/api/admin/coupons/:id` | PUT | クーポン更新 |
| `/api/admin/coupons/:id` | DELETE | クーポン削除 |
| `/api/admin/usage-logs` | GET | 使用履歴取得 |

## 🎯 開発のポイント

1. **BEAMS風デザイン:** オレンジ (#FF6600) をアクセントカラーに使用
2. **レスポンシブ:** モバイルファーストでの開発
3. **アニメーション:** Framer Motionで滑らかなUX
4. **型安全:** TypeScriptによる厳密な型付け
5. **リアルタイム:** Supabase Realtimeで即座に反映

## 📄 ライセンス

プロトタイプ用のため、商用利用には別途ライセンスが必要です。

