---
title: "route53のDDNS"
date: 2025-06-01
tags:
  - infra
  - aws
  - dns
  - route53
  - ddns
---

## はじめに
最近自宅サーバを立てました。そんでドメインを取得し、外部からアクセスできるようにしたのでDDNS作りました。
本当はプロバイダの固定IPが使えればいいのですが、あいにく個人向けに固定IPのサービスをしてないらしいです（あっても金払いたくないし）
検索した感じいろんな人がroute53のDDNSを実現しているのでためになるか分かりませんが、参考にどうぞ

また、この記事ではすでに手動でroute53のレコードを設定していて、ドメインでサーバにアクセスできている状態から始めます。
それ以外の設定は扱いません。


## 環境
- Ubuntu 24.04.2 LTS
- aws-cli/2.27.25
- jq-1.7

## 作り方
本当はライブラリとかサービスを使ってパパっと終わらせたかったのですが、いろいろうまくいかなかったので結局オンプレで
1. IPアドレスを取得
2. AWS CLIで書き換え
3. cronで定期実行

という風に落ち着きました。

IPアドレスは`curl -s inet-ip.info`で取得できます。これが肝です。どうやらオープンソースのWebサービスらしいですな


余談、aws-r53という書き換えが簡単にできるよ～みたいなラッパースクリプトを試したのですが、僕の環境ではうまくいきませんでした。
[little-forest/aws-r53](https://github.com/little-forest/aws-r53/tree/master)



### IAMユーザの設定
route53のレコードを書き換えるためのポリシーです。
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "route53:ChangeResourceRecordSets"
            ],
            "Resource": "*"
        }
    ]
}
```

アタッチしたユーザを`aws configure`でCLIと紐づけます。


### bashを置く
jqを事前にインストールしておきます。

https://qiita.com/wnoguchi/items/70a808a68e60651224a4

そしたらbashとひな形のJSONを同じディレクトリにコピペなりクローンなりしてください

https://github.com/mitsuiJao/route53_ddns/blob/main/ddns.sh

https://github.com/mitsuiJao/route53_ddns/blob/main/changes.json


置いたら`ddns.sh`のHOSTED_ZONE_IDを該当のIDに置き換えてください

### cronの設定
そんなに頻繁にグローバルIPは変わるものじゃないので5分間隔で実行します。1時間とかでもいいと思う

```
*/5 * * * * your/bash/path/ddns.sh >> /logging/path/ddns.log 2>&1
```

ロギングはあってもなくてもいいよ～、物量少ないし

## おわり
初回はcronのログ見れば正常に実行されているかどうかわかると思います！以上！

> テスト勉強しないとな。。