---
title: "Pico用のe-paperをラズパイで使うには"
date: 2025-09-01
tags:
  - embedded
  - raspberrypi
  - raspberrypipico
  - epaper
  - micropython
---

↓僕が買ったやつ

https://www.waveshare.com/pico-epaper-7.5-b.htm

picoだとメモリが足りないのでRaspberry pi 3 model Bを使います。
pico用のe-paper変換ドライバーはラズパイで直接使えないのでジャンパ線でつなぎます。

# 配線

| 名前 | ラズパイGPIO | ← pinNo | Pico GPIO | ← pinNo | 
| ------- | ------------ | ------------- | --------- | ---------- | 
| VCC     | 3.3V PWR     | 1             | VSYS      | 39         | 
| GND     | GND          | 6             | GND       | 38         | 
| DIN     | GPIO10       | 19            | GP11      | 15         | 
| CLK     | GPIO11       | 23            | GP10      | 14         | 
| CS      | GPIO8        | 24            | GP9       | 12         | 
| DC      | GPIO25       | 22            | GP8       | 11         | 
| RST     | GPIO17       | 11            | GP12      | 16         | 
| BUSY    | GPIO24       | 18            | GP13      | 17         | 
| 3V3out  | GPIO18       | 12            | 3V3(OUT)  | 36         | 


picoの変換ボードの裏には使っているピンとその名称がいろいろ書いてあるのでそれを確認しながらやります。
またなんかよく分からんけど3V3outとかっていうピンもあるので忘れないようにしましょう。僕はこれで半日潰しました。

あとショートには気を付けよう。