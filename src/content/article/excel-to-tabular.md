---
title: "ExcelからLaTeXのtabularに変換するために(忘備録)"
date: 2025-07-14
tags:
  - automation
  - excel
  - latex
  - tabular
  - csv
---

## 結論
![](/excel-to-tabular/image1.png)
`=TEXT({value},"0.00E+0")`

![](/excel-to-tabular/image2.png)
`=REGEXREPLACE({value}, "([0-9]\.[0-9]{2})E(-?[0-9])", "\$$1\\times 10^{$2}\$")`

![](/excel-to-tabular/image3.png)


https://rra.yahansugi.com/scriptapplet/csv2tabular/

このサイトでCVSからtabularに変換、
![](/excel-to-tabular/image4.png)


指数部が負数でも対応、有効数字は適宜変えて下さい。ある程度正規表現が分かればわかると思います。TEXT関数は数値から直接変換できないので使う必要がありました。
毎回この形式、この有効数字ではないと思うので臨機応変にできたらと思います。今回紹介したものはほんの一例です。例えば今回の例でも指数部が2桁あると正常にならないと思います。


Excelって毎回思うけどそんなに理系向いてないよなとも思いながら、も使うんですけどぬぇ