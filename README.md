# homepage

Astro 製のテック系サイト（静的）。

## セットアップ

```bash
npm install
```

## 開発・ビルド

```bash
# 開発サーバー: http://localhost:4321
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

---

## 主な構成

- **`src/config.json`** … サイトタイトル、説明、ルート（ナビの順序とリンク）
- **`src/content/pages/`** … 静的ページのマークダウン
- **`src/content/article/`** … 記事のマークダウン（一覧は `/articles`、個別はルート `/slug`）

## 記事の追加

- **`src/content/article/`** には記事（マークダウン）のみを置く。画像はここには置かない。
- **画像** は `public/` に置く。記事からはサイトルート基準の絶対パスで参照する（例: `/webclass-notify/image.png`）。

**記事のみ（単一ファイル）**: `src/content/article/xxx.md`

**記事をディレクトリで管理する場合**: `src/content/article/xxx/index.md`。画像は `public/xxx/` に配置し、マークダウンでは `/xxx/image1.png` のように指定する。

例（webclass-notify）:
```
src/content/article/webclass-notify/
  └── index.md
public/webclass-notify/
  ├── image1.png
  └── image2.png
```

マークダウン例: `![説明](/webclass-notify/image1.png)`

フロントマター例:

```yaml
---
title: 記事タイトル
date: 2025-02-19
tags:
  - astro
  - setup
---
```

## LaTeX（数式）

`remark-math` と `rehype-katex` でマークダウン内の数式をレンダリングする。

- インライン: `$f(x) = x^2 + 1$`
- ブロック: `$$\frac{a}{b}$$`

例:
```markdown
$E = mc^2$ や $$\sum_{i=1}^n i = \frac{n(n+1)}{2}$$
```

## リンクカード

マークダウンで単独行に URL を書くと OGP カードに変換される（`rehype-og-card`）。

## テーマ

ダークモード（`BaseLayout.astro` の CSS 変数で制御）。

---

## GitHub 運用

- 記事を追加するとき: main ブランチで作業
- ページ構成を変更するとき: ブランチを切ることを推奨
