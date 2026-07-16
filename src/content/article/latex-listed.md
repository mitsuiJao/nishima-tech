---
title: LaTeXよく使うやつまとめ
date: 2026-07-16
tags: ["latex"]
---

$\LaTeX$は最近になってLLMに正確に数式を与えるのによく使うようになりました。

よく使うやつだけをまとめてます。これだけ覚えれば大体の式は掛けるってやつの覚書きです

- 基本 `x_1 - x^2 + x^{2e}`

上か下につく文字が1つの時波括弧を省略できる
$$
x_1 - x^2 + x^{2e}
$$

- 分数 `\frac{a}{b}`
$$
\frac{a}{b}
$$

- 三角関数 `\sin x, \cos \theta, \arctan t`
$$
\sin x, \cos \theta, \arctan t
$$

- 対数 `\log_{10} 100, \ln x`
$$
\log_{10} 100, \ln x
$$


- 積分 `\int_a^b x^2 dx`
$$
\int_a^b x^2 dx
$$

- 重積分 `\iiint_V f(x, y, z) dxdydz`
$$
\iiint_V f(x, y, z) dxdydz
$$


- 偏微分 `\frac{\partial y}{\partial x}`
$$
\frac{\partial y}{\partial x}
$$

- シグマ `\sum_{k=1}^n k`
$$
\sum_{k=1}^n k
$$


- 要素 `x \in \mathbb{Z}^+`
  
`\mathbb`は黒板文字
$$
x \in \mathbb{Z}^+
$$

- 不等号 `a \ge b, b \le a, a \ne b, x \approx y`
$$
a \ge b, b \le a, a \ne b, x \approx y
$$


- 論理記号 `\forall, \exists, \land, \neg, \lor`
$$
\forall, \exists, \land, \neg, \lor
$$

- 集合の論理 `\cup, \cap, \subset`
$$
\cup, \cap, \subset
$$

- ギリシャ文字`\pi \Pi \phi \Phi \varphi `
$$
\pi \Pi \phi \Phi \varphi 
$$

- 極限 `\limit_{x \to \infty} f(x)`
$$
\lim_{x \to \infty} f(x)
$$

- 矢印 `\to \Rightarrow \leftrightarrow \Leftrightarrow \iff`
$$
\to \Rightarrow \leftrightarrow \Leftrightarrow \iff
$$




### その他
- \fracは**数字のみ**の場合波括弧を省略できる `\frac12`
$$
\frac12
$$

- 点とか`1 \cdot 2 \cdots n`
$$
1 \cdot 2 \cdots n
$$

- dotsほかに ` \vdots \rdots`
$$
\vdots \ddots
$$

- ベクトル `\mathbf{a}, \vec{a}`
$$
\mathbf{a}, \vec{a}
$$


- 表

いろんなサイトがあるので変換して使うのが早い

https://latex-matrix.netlify.app/
