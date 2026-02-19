# homepage-monorepo — プロジェクト概要

npm workspaces によるモノレポ。Astro のテックサイト（`apps/homepage`）と Next.js アプリ（`apps/next`）を含む。

---

## ディレクトリ構成

```
apps/
├── homepage/              # Astro 製テックサイト
│   ├── src/
│   │   ├── config.json    # サイトメタ・ルート定義（ナビの元）
│   │   ├── content/
│   │   │   ├── config.ts  # Content Collections のスキーマ（article, pages）
│   │   │   ├── article/   # 記事のみ（個別 URL はルート /slug）。画像は置かない
│   │   │   │   ├── xxx.md          # 単一ファイル
│   │   │   │   └── yyy/index.md    # ディレクトリ + index.md
│   │   │   └── pages/     # 静的ページ用 .md
│   │   ├── layouts/
│   │   │   └── BaseLayout.astro
│   │   ├── components/
│   │   │   ├── Footer.astro
│   │   │   └── MarkdownContent.astro
│   │   └── pages/
│   │       ├── index.astro
│   │       ├── about.astro
│   │       ├── articles.astro
│   │       ├── tags/
│   │       │   ├── index.astro
│   │       │   └── [tag].astro
│   │       └── [slug].astro
│   ├── public/            # 静的アセット。画像はここに置く（例: public/webclass-nortify/image.png）
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   └── package.json       # @repo/homepage
│
└── next/                  # Next.js アプリ
    ├── src/
    │   └── app/
    ├── package.json       # @repo/next
    └── ...
```

---

## ルート package.json

- **workspaces**: `["apps/*"]`
- **scripts**:
  - `dev:homepage` / `dev:next` … 各アプリの開発サーバー
  - `build:homepage` / `build:next` … 各アプリのビルド
  - `build` … 両方ビルド

---

## apps/homepage のルーティング

- **静的**: `src/pages/*.astro` と対応。ナビは `config.json` の `routes` から生成。
- **記事**: `src/content/article/*.md` または `src/content/article/*/index.md` がルート直下の URL。`index.md` の場合は slug から `/index` を除去（例: `webclass-nortify`）。
- **タグ**: `/tags` で一覧、`/tags/[tag]` でフィルタ表示。

---

## コンテンツ（homepage）

- **article**: `title`, `date`（任意）, `tags`（任意・配列）。`src/content/article/` には記事（.md）のみを置く。画像は **public にのみ** 置き、記事からはサイトルート基準の絶対パスで参照する（例: `/webclass-nortify/image.png` → `public/webclass-nortify/image.png`）。
- **pages**: `title` のみ。`getEntry('pages', 'slug')` で取得。
- OGP カード: `rehype-og-card`（`astro.config.mjs` の `markdown.rehypePlugins`）でベアリンクをカード化。
- LaTeX: `remark-math` + `rehype-katex` で数式をレンダリング。インライン `$...$`、ブロック `$$...$$`。KaTeX の CSS は BaseLayout で読み込み。

---

## 主要ファイルの役割

| ファイル | 役割 |
|----------|------|
| `apps/homepage/src/config.json` | サイトタイトル・説明・`routes` |
| `apps/homepage/src/content/config.ts` | article / pages の Zod スキーマ |
| `apps/homepage/src/layouts/BaseLayout.astro` | 共通レイアウト、ナビ、フッター、OGカード用CSS |
| `apps/homepage/src/components/Footer.astro` | 共通フッター（著作権・免責・リンク） |
| `apps/homepage/astro.config.mjs` | rehype-og-card、remark-math、rehype-katex の設定 |
| `apps/next/` | Next.js App Router アプリ |
| `README.md` | 利用者向けセットアップ・使い方 |

---

## 運用メモ

- **テーマ**: homepage はダークモード（BaseLayout の CSS 変数で制御）。
- **新規静的ページ**: `apps/homepage/src/content/pages/xxx.md` + `src/pages/xxx.astro` を追加し、config.json の routes に追加。
- **新規記事**: 記事は `article/xxx.md` または `article/xxx/index.md`。画像は必ず `public/xxx/` に置き、マークダウンでは `/xxx/image.png` のように指定する。
- **リンクカード**: マークダウンで単独行に URL を書くと OGP カードに変換される。
- **LaTeX**: インライン `$...$`、ブロック `$$...$$` で数式を記述できる。

---

## ドキュメント更新ルール

- このファイル（`.cursor/PROJECT.md`）は、**プロジェクトの構成・ルーティング・主要ファイルの役割**をまとめた Cursor 用の参照用ドキュメントである。
- **編集時に必ず参照する**: Cursor でこのリポジトリを編集するときは、まずこのファイルを読んで構成と慣習を把握すること。
- **変更時に更新する**: ディレクトリ構成の変更、新規アプリ・ページ・記事の追加、ルーティングや config の変更など、プロジェクトの内容に影響する変更を行った場合は、**README.md と同様に**このファイルも都度更新すること。
