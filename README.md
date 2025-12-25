# 🌱 夫婦畑日記

80代のご夫婦が毎日の畑作業を「写真1枚＋一言」で記録できるシンプルなWebアプリです。

## 特徴

- **ログイン不要**: 「父」「母」ボタンをタップするだけで投稿者を切り替え
- **大きな文字とボタン**: 高齢者でも見やすく、操作しやすいUI
- **PWA対応**: ホーム画面に追加してアプリのように使用可能
- **シンプル設計**: 迷わず・失敗せず・続けられることを最優先

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL + Storage)
- **デプロイ**: Vercel

## セットアップ

### 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) でアカウントを作成
2. 新しいプロジェクトを作成
3. `supabase_setup.sql` の内容をSQL Editorで実行
4. Storage で `images` バケットを作成（Public bucket）

### 2. 環境変数の設定

`.env.local.example` を `.env.local` にコピーし、Supabaseの認証情報を設定：

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 開発サーバーの起動

```bash
pnpm install
pnpm dev
```

### 4. Vercel へのデプロイ

1. GitHubにリポジトリをプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## ページ構成

| ページ | URL | 説明 |
|:---|:---|:---|
| トップ | `/` | 今日の投稿表示 + 新規投稿 |
| 一覧 | `/posts` | 過去の投稿を日付ごとに表示 |
| カレンダー | `/calendar` | 月別カレンダーで投稿を閲覧 |

## 高齢者向けUXの工夫

1. **文字サイズ切替**: 小・標準・大の3段階（デフォルトは「大」）
2. **色分け**: 父は緑系、母はオレンジ系で視覚的に区別
3. **最小限のUI**: ボタンは大きく、数は最小限
4. **誤操作防止**: 削除ボタンは通常画面に表示しない
5. **下書き自動保存**: 入力途中で画面を閉じても内容が保持される
6. **PWA対応**: アプリのようにホーム画面から起動可能

## ディレクトリ構成

```
src/
├── app/
│   ├── _components/     # 共通コンポーネント
│   │   ├── author-switcher.tsx
│   │   ├── calendar-view.tsx
│   │   ├── font-size-switcher.tsx
│   │   ├── header.tsx
│   │   ├── post-card.tsx
│   │   ├── post-form.tsx
│   │   ├── post-list.tsx
│   │   └── today-posts.tsx
│   ├── calendar/
│   │   └── page.tsx
│   ├── posts/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── supabase.ts
└── types/
    └── index.ts
```

## ライセンス

MIT
