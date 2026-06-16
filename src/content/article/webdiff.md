---
title: "WebDiff — テキスト差分ツール"
date: 2026-06-16
tags:
  - react
  - typescript
  - vite
  - cloudflare
  - tools
---

## 成果物

https://diff.nishima-tech.com

## 概要

2つのテキストを貼り付けて差分を視覚的に確認できる Web ツールです。Githubが出しているコンポーネントがあることを最近知ったので、GitHub Primer の UI コンポーネントを採用しました。

簡単ですぐ使えるやつにしました。

## 技術スタック

| 役割 | ライブラリ / ツール |
|------|-------------------|
| ビルドツール | Vite 6 |
| UI フレームワーク | React 18 + TypeScript |
| UI コンポーネント | GitHub Primer (`@primer/react`) |
| 差分エンジン | `diff` (npm) |
| ホスティング | Cloudflare Pages |

差分の計算には npm の [`diff`](https://www.npmjs.com/package/diff) パッケージを使っています。`diffLines()` で行単位の差分を取得し、追加・削除・変更なしの 3 種類の `Change` オブジェクトとして受け取ります。それを Split View と Unified View それぞれのコンポーネントに渡して描画する、というシンプルな構成です。


## Cloudflare Pages へのデプロイ

リポジトリを Cloudflare Pages に接続するだけで動きます。設定値はこちら。

| 設定項目 | 値 |
|---|---|
| ビルドコマンド | `npm run build` |
| 出力ディレクトリ | `dist` |
| Node.js バージョン | 18 以上 |

GitHub にプッシュするたびに自動でビルド・デプロイされるので運用がらく。無料。
