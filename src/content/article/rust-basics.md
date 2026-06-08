---
title: "rust基本文法"
date: 2024-12-16
tags:
  - rust
---

後輩がRustできてて焦った。時代はRustなのか
自分用の殴り書き

モジュール系は今回除外

## 変数宣言
rustは強い型推論があるらしいからあんまり気にしないでもいいみたい
でも書いたほうがいいきがするよ
```rust
// コメントアウト
let x = 5;         //標準で不変
let mut y = 5;     //mutを付けると可変

let a: i32 = 10;   //整数型32bit
let b: u32 = 20;   //整数型32bit (unsigned)

const PI: f32 = 3.141592; //constは型指定必須
```

## 分岐
```rust
let n = 10;
if n < 0 {
    println!("{} < 0", n);   //Cのフォーマットみたいなやつ
} else if n > 0 {
    println!("{} > 0", n);
} else {
    println!("{} = 0", n);
}
```
ん～なんかif letみたいなやつがあるらしい

## 繰り返し
```rust
let mut x = 0;
loop { 
    println!("{}", x);
    if x == 10 {
        break;
    }
    x += 1;
}; //breakが必要

x = 0;
while x <= 10 {
    println!("{}", x);
    x += 1;
};

for i in 0..3 {
    println!("{}", i);
}
//0, 1, 2
//pythonのrangeみたいなやつ

let vec = vec![10, 20, 30];
for v in vec {
    println!("{}", v);
}
//c++のvectorみたいな配列じゃないとだめらしい、普通の配列はだめ
//iteratorがなんやかんやしているらしい
```
ちなみにこっちもwhile letがある！

## 関数宣言
fnを使う
main関数が最初に呼び出される
```rust
fn　main() {
    println!("Hello World!");
    my_function();
}

fn my_function(foo: i32, bar: i32) -> i32 {
    println!("this is my_function");
    println!("{}, {}", foo, bar");
    foo + bar
}
//仮引数の型指定が必須
// ->で戻り値の型指定
// 最後の式が暗黙的に戻り値になる
// セミコロンを付けると文になる->エラー
```
どうやら式と文が明確に分けられていて、それを明確に使い分けなければいけない。
戻り値の型を後ろの方に書くの、見にくいかも

## 配列
https://qiita.com/k-yaina60/items/26bf1d2e372042eff022
この記事めっちゃ助かります

```rust
let arr: [i32; 3] = [0, 1, 2];
//固定長、スタック
let v: Vec<i32> = vec![0 ,1, 2];
//可変長、ヒープ
//ヒープへのptr, length, capacity の要素を持つ
```
スライスはまた今度！

## 所有権について
https://www.tohoho-web.com/ex/rust.html#ownership
助かります。

> ただひとつの変数がヒープ上のメモリの 所有権(ownership) を持ち、所有者がスコープから消えた時点でヒープ領域も開放されます。

つまりはヒープ領域を使うときは所有権を意識しなければいけないらしいですな

```rust
fn main() {
    let name = String::from("Satou");
    //nameがString, Satouの所有権を持つ
    //Stringはヒープ領域を使う
    println!("{}", name);
}   //nameが所有権を失い、ヒープ領域も解放される
```

関数呼出しによる所有権の移動、借用ができる
String以外にもBox<T>で任意の型のヒープが使えます
詳しくはリンク先のほうがわかりやすいです


## クラス（みたいなやつ）
Rustにはクリティカルなクラスを提供してないです。
ちなRust公式もオブジェクト指向であるともでないとも言い切ってないです。
おれてきにはオブジェクト指向に慣れてるので手続き型？関数指向？がよくわかんないです

### 構造体
```rust
struct Point {
    x: i32,
    y: i32
}

fn main() {
    let p = Point {
        x: 1,
        y: 5
    }

    println!("{}, {}", p.x, p.y);
}
```
だいたい他の言語と一緒

[公式ドキュメント](https://doc.rust-jp.rs/rust-by-example-ja/custom_types/structs.html) によると
> structというキーワードを用いて作成できる構造体には3種類あります。
> - タプル。（すなわちタプルに名前が付いたようなもの）
> - クラシックなC言語スタイルの構造体。
> - ユニット。これはフィールドを持たず、ジェネリック型を扱う際に有効です。

とのことで、今回はクラシックなスタイルですねー
structをフィールドに持つstructを作ることもできるそうです。ネストみたいな

### インプリメンテーション
日本語で実行、実装の意らしいてす
structにメソッドを追加できるみたいな感じ
```rust
impl Point {
    fn length_from0 (&self) -> f32{
        let x = self.x as f32;
        let y = self.y as f32;
        (x * x + y * y).sqrt()
    }
}

fn main() {
    let p = Point { x: 1, y: 5 }
    println!("{}", p.length_from0);
}

```
↑動くかわからんでも多分こんな感じ
Pythonみたいにselfは自分自身を示す


### トレイト
[公式ドキュメント](https://doc.rust-jp.rs/book-ja/ch10-02-traits.html)によると、
> トレイトは、Rustコンパイラに、特定の型に存在し、他の型と共有できる機能について知らせます。 トレイトを使用すると、共通の振る舞いを抽象的に定義できます。トレイト境界を使用すると、 あるジェネリックが、特定の振る舞いをもつあらゆる型になり得ることを指定できます。

何のことかピンときませんが。インターフェイスと呼ばれる機能の類似しているそうです。

```rust
// traitの定義
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}

// traitの実装
impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}
```
ん～メソッドの型を決めとこう～みたいなことなのか

## 以上
次はjavaかじろうカナ。バイトしなきゃだネ。