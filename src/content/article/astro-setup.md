---
title: Astro でサイトを立てる
date: 2025-03-08
tags:
  - astro
  - setup
---

## Astroでサイトを構築しよう

Astro は、コンテンツ駆動型の高速なサイトを作成することに特化したモダンなフレームワークです。Markdownを標準でサポートしており、ドキュメントサイトやブログの構築に最適です。

本サイトも、この Astro を利用して構築・運用されています。

### Astroの主な特徴
- アイランド・アーキテクチャによる読み込みの高速化
- コンポーネントによってフレームワークの使い分けが可能
- デフォルトでJSを排除


フロントエンドフレームワークといえば React、Vue、Angular が主流ですが、単なる静的サイトにとっては機能がリッチすぎて過剰な場合があります。

実際、単純なブログ等では useEffect による複雑な副作用制御は不要ですし、ログイン機能も必要ありません。こうした不要な機能を徹底的に削ぎ落とすことで、JavaScript をほぼ排除した、圧倒的に高速なページ読み込みが可能となります。


## セットアップ

AstroはES Modulesで動くのでtypeフィールドはmoduleにする必要があります。
```json title="package.json"
{
  "name": "my-astro-site",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "latest"
  }
}
```

### ディレクトリ構造
基本的な構造はシンプルで、`src/pages/index.astro`がメインページになります

```
.
├── package.json
└── src/
    └── pages/
        └── index.astro
```

ターミナルで以下のコマンドを実行するだけで、すぐに開発環境が整います
- インストール `npm install`
- 起動 `npm run dev`

起動後、ローカルホストにアクセスすれば、作成したページのプレビューを確認しながら開発を進められます。

公式ドキュメント
https://docs.astro.build/
