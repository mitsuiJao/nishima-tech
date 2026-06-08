---
title: "Sympy早見"
date: 2025-11-25
tags:
  - programming
  - python
  - sympy
---

sympyの関数をちょこっと見たいのにそんな記事がない。
ちょっと積分できればいい。強力な関数電卓が使いたいなあ、そんな方向け
あと自分用
解説はそんなにないです。

### 基本
- import
```python
from sympy.abc import *
from sympy import *
```
インタラクティブモードでの使用を想定、スクリプトをちゃんと書くときは`import *`は避けるべき

- 汎用
```python
pi                              # 円周率
E                               # ネイピア数
I                               # 虚数単位
oo                              # 無限
sin(x)                          # 正弦
cos(x)                          # 余弦
tan(x)                          # 正接
factorial(x)                    # 階乗
```

- 出力
```python
print()                         # 標準
print(str())                    # python文字列
latex()                         # LaTeXソースコード
```

### 代数

$$
E = (x^2-4)(x+2)
$$

```python
E = (x**2 - 4) * (x + 2)        # 定義

expand(E)                       # 展開
factor(E)                       # 因数分解
simplify(E)                     # 簡易化
E.subs(x, 3)                    # x=3 代入

equation = Eq(E, 0)             # 方程式の定義、左辺=右辺
solve(equation, x)              # xの解
```

メモ
部分分数分解 `apart()`


### 微積分

$$
f(x) = x^3 + 4x^2 - 4x - 16
$$

```python
f_x = x**3 + 4*x**2 - 4*x - 16  # 定義

diff(f_x, x)                    # 微分
integrate(f_x, x)               # 不定積分
integrate(f_x, (x, 0, 1))       # 定積分    0->1
```

$$
f(x) = \frac{\ln(x)}{x}
$$

```python
f_x = log(x) / x                # 定義

limit(f_x, x, oo)               # 極限     x->無限
```
ロピタル不要

### 解析

$$
f(t) = 5e^{-3t} + 2
$$

```python
f_t = 5 * exp(-3 * t) + 2       # 定義

f_s, a, cond = laplace_transform(f_t, t, s)     # ラプラス変換 原関数, 原関数変数, 像関数変数
                                                # -> 像関数, 収束条件パラメータ, 条件式

                                                # 虚数解の場合
simplify(expand(f_s))                           # 展開
simplify(together(f_s))                         # 通分

f_t = inverse_laplace_transform(f_s, s, t)      # ラプラス逆変換
```

### 統計
```python
functions.combinatorial.numbers.nC(4, 2)        # 組み合わせ combination
functions.combinatorial.numbers.nP(4, 2)        # 順列 permutation
```

今後使うことあったら他にも追加するかも