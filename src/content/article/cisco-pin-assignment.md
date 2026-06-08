---
title: "Cisco 4pin 電源のピンアサイン"
date: 2025-09-22
tags:
  - infra
  - cisco
  - router
---

> **注意:** ショートには十分気を付けよう

## 始めに
最近Cisco891fを買ったんですけど、ACアダプター60Wとか1個1000円はしますよね、
1つだったらいいんですけど、5個買ったのでそれぞれACアダプターを使うのは馬鹿にならないです
そこで安定化電源を買ったのはいいものの、Cisco特有の4pinのピンアサインが全然見当たらなかったので書いておきます

## ピンアサインはこれだ
コネクタはよくある電源ユニットについてあるATX12Vをそのまま使うことができますが、ピン配列が違うので配線を入れ替える必要があります

![](https://storage.googleapis.com/zenn-user-upload/a9efd9c32877-20250922.jpeg =300x)

| 爪        | 爪                  | 
| --------- | ------------------- | 
| pin3: 12V | pin4: -53.5V        | 
| pin1: GND | pin2: -53.5V Return | 

コネクタを爪を上に正面から見た時の表です
53.5VはPoE用で、僕は使ってません


## 参考
https://www.manualslib.com/manual/1401405/Cisco-890-Series.html?page=4#manual
https://pinoutguide.com/ChargersAdapters/Cisco_890_Series_PSU_pinout.shtml
↑ここに書いてある表は違うので注意


#### P.S.
![](https://storage.googleapis.com/zenn-user-upload/0428660e85a7-20250922.jpeg =500x)
https://amzn.asia/d/5BqGOKU

AC100V -> DC12V に変換する安定化電源です

このルータはPoE不使用時はMAX60Wなのでx5で300Wの電源です、ギリギリだけど