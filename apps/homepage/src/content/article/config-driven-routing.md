---
title: config.json でルーティング
date: 2025-02-19
tags:
  - config
  - routing
---

## 設計

`src/config.json` でナビゲーションとルートを定義する。

- 静的ページ: path と content ファイルを対応付け
- 動的ページ: コレクション名を指定して `[slug]` で展開

この方式だと、ページの追加や並び替えは config の編集だけで済む。
