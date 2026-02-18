# homepage-monorepo

npm workspaces によるモノレポ。Astro のテックサイトと Next.js アプリを含む。

## 構成

```
apps/
├── homepage/   # Astro 製のテック系サイト（静的）
└── next/       # Next.js アプリ
```

## セットアップ

```bash
npm install
```

## 開発・ビルド

```bash
# Astro（homepage）: http://localhost:4321
npm run dev:homepage

# Next.js: http://localhost:3000
npm run dev:next

# ビルド
npm run build           # 両方ビルド
npm run build:homepage  # Astro のみ
npm run build:next      # Next.js のみ
```

---

## apps/homepage（Astro）

マークダウンでコンテンツを記述し、`config.json` でナビを制御するテック系サイト。

### 主な構成

- **`src/config.json`** … サイトタイトル、説明、ルート（ナビの順序とリンク）
- **`src/content/pages/`** … 静的ページのマークダウン
- **`src/content/article/`** … 記事のマークダウン（一覧は `/articles`、個別はルート `/slug`）

### 記事の追加

`apps/homepage/src/content/article/` にマークダウンファイルを置く。フロントマター例:

```yaml
---
title: 記事タイトル
date: 2025-02-19
tags:
  - astro
  - setup
---
```

### リンクカード

マークダウンで単独行に URL を書くと OGP カードに変換される（`rehype-og-card`）。

### テーマ

ダークモード（`BaseLayout.astro` の CSS 変数で制御）。

---

## apps/next

Next.js 16 + App Router + Tailwind CSS。開発用途に応じてカスタマイズする。

---

## GitHub 運用

- 記事を追加するとき: main ブランチで作業
- ページ構成を変更するとき: ブランチを切ることを推奨
