---
title: iptablesまとめ
date: 2025-06-28
tags:
  - linux
  - iptables
---

iptablesコマンドはオプションが多くて毎回覚えてらんないため, ufwでいいんだけどちょっと開けるときに


## 簡単に仕組み
**テーブル**：
ルールで分けたテーブル
filter, nat, mangle, rawの4種類


**チェーン**：
パケットがカーネルを通るときのポイント
PREROUTING, INPUT, FORWARD, OUTPUT, POSTROUTING の5種類

## 確認
```bash
sudo iptables -L -n -v --line-numbers
```

- -L リスト表示
- -n IPやポートを名前解決せずに表示
- -v パケット数・バイト数を表示
- --line-numbers 行番号を表示

ここはコピペ用


## 追加
```bash
# 末尾に追加
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 末尾先頭に追加
sudo iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT

# 送信元IPを指定
sudo iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT
```

### サブコマンド
**必須**

| オプション | 意味 |
|---|---|
| `-I` | 先頭に挿入 |
| `-A` | 末尾に追加 |
| `-D` | ルールを削除 |
| `-R` | ルールを置換 |
| `-L` | ルール一覧表示 |
| `-F` | チェーンのルールを全削除 |
| `-N` | 新しいチェーンを作成 |
| `-X` | チェーンを削除 |
| `-P` | チェーンのデフォルトポリシーを設定 |

`-I INPUT 3`ならINPUTチェーンの先頭から3番目に挿入


### ジャンプ
**必須**

-j はjumpの略、そのあとに続くターゲット↓

| ターゲット | 動作 |
|---|---|
| `ACCEPT` | 通す |
| `DROP` | 捨てる（応答なし） |
| `REJECT` | 拒否応答を返して捨てる |
| `LOG` | ログだけ記録|
| `MASQUERADE` | 送信元IPをNATで書き換え（OUTPUTチェーン向け） |
| `SNAT` | 送信元IPを指定IPに書き換え |
| `DNAT` | 宛先IPを書き換え（ポートフォワード等） |
| `RETURN` | 現在のチェーンを抜けて呼び出し元に戻る |



## その他
| オプション | 意味 |
|---|---|
| `-p` | プロトコル（tcp/udp/icmp等） |
| `-s` | 送信元IP |
| `-d` | 宛先IP |
| `--sport` | 送信元ポート |
| `--dport` | 宛先ポート |
| `-i` | 入力インターフェース（eth0等） |
| `-o` | 出力インターフェース |
| `-m` | 拡張モジュールの指定 |

`--dport`, `--sport`は`-p tcp`などとセットで使う

