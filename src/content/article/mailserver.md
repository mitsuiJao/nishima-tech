---
title: メールサーバーを無料でホスト
date: 2026-07-22
tags: ["web", "oci"]
---

## メールサーバーを自分で作りたい！
独自ドメインを取得・公開して数か月がたちました。

どうせならメールサーバーを独自ドメインで運用してかっちょよくしたかったので、**無料で**メールサーバーを運用したいと思います。

要件としては
- 可用性を高める
  - スパム扱いされないこと
- 無料でできること！
- 利便性

1番はやはり可用性でしょうか。鯖が落ちていてメール届きませんは話になりませんね。


構築してメールサーバー構築と運用はなかなか根気が必要だと思いました。頑張りましょう！



## ホストは？
ホストするためにoracleのクラウド、OCIを使用します。AWSやAzureに比べて圧倒的な安さと無料枠が豊富なクラウドサービスです。

oracle大好き↑

https://www.oracle.com/jp/cloud/


OCIのアカウントにはPAYGという従量課金があり、PAYGではないアカウントは永遠に課金されずに無料会員としてリソースが使える、という状態です。

しかし無料会員はマジでインスタンス取れないので、潔くPAYGアカウントに移行することをおすすめします。

無料会員でインスタンスを取得するスクリプトを1日回しても取れなかったのですが、PAYGだと普通に取れました。リソースが完全に分かれてるんだと思います。

PAYGアカウントでも無料会員と同じ量の無料枠を使用できるので、すぐに課金されることはありません。

しかし無料枠を超えると普通に課金されるので、アラームなどを設定して監視する必要はありそうです。

https://www.oracle.com/jp/cloud/free/


(PAYG = Pay As You Go)


## 構築
環境まとめ
- OCI
  - Oracle Linux Server release 9.7
  - Docker 29.6.1
  - Dcoekr Compose 5.3.1
- Cloudflare (ドメイン取得もここ)

この記事では2026年7月時点の情報です。OCIは頻繁に使用が変更されることに留意してください！

---
### 1. OCI インスタンス
OCIの基本のことはあんまり説明しないかもです。知ってれば役に立つかも？くらいのことだと思ってくださいお願い🙏🙏

インスタンスを作成します。おすすめはAmpere VM.Standard.A1.Frex の 1OCPU / 1GB RAM です 

イメージはなんでもいいです。僕は間違えてoracle linuxとかいうやつにしちゃったのですが、普通にUbuntuでいいです。

![](/mailserver/image1.png)


全アカウント共通で使える無料枠はVM.Standard.A1.FrexのAmpereで全インスタンス合計 OCPU2 / 12GB RAM まで使えます

ボリュームは全インスタンス合計200GBまで無料で使えます。

---

OCIではインスタンスのブートボリュームに割り当てられるのが50GB~なので、最低でも50GBが割り当てられることになります。つまり無料枠ではインスタンス4つが限界ということです。


私は1OCPU / 1GB RAMを割り当てて数GBをスワップとして割り当てています。

システムを構築後にモニタリングを確認しても常時50%程度です。

あとからシェイプは変えられるので、きつくなったら増やせば大丈夫

![](/mailserver/image2.png)


あとIPはエフェメラルIPから予約済みのIPに必ずしてください。IPが変わると使い物にならないです。

詳しくは調べてみて

---
### 2. OCI ネットワーク
割り当てたVNICのサブネット -> セキュリティタブのセキュリティ・リスト -> セキュリティ・ルール

イングレスルールを設定します。イングレスルールってのはまあインバウンド向きってことです

空けるポートはこれ

| ポート | プロトコル | 用途                          |
|--------|-----------|-------------------------------|
| 22     | TCP       | SSH Remote Login              |
| 25     | TCP       | SMTP(メール受信)              |
| 587    | TCP       | Submission(送信・SMTP AUTH)   |
| 465    | TCP       | SMTPS(暗号化送信)             |
| 993    | TCP       | IMAPS(メール受信・TLS)        |
| 443    | TCP       | HTTPS(Webmail/証明書更新等)   |


443は無くてもいいです。ブラウザでGmailみたいにメールを確認したいとかなら必要になります。

#### outbound 25 について
SMTPのメール送信をするためには25番ポートをアウトバウンド向きで開ける必要がありますが、
スパム対策のためどこのクラウドサービスもデフォルトでは開けてないです。

OCIももれなくデフォルトで空いていないのですが、サービスに問い合わせると開けてもらえると思ってたので、問い合わせてみました。

![](/mailserver/image3.png)

返信は3営業日くらい空きました。早くはないですが、無料なので全然いいです

まとめると
- PAYGアカウントであること
- OCIアカウントが1年前以上前に作成されたこと

が必須なようです。これは知らなかった

ということで一緒に紹介されているOracle Email Deliveryサービスを使うことにします

Oracle Email Deliveryサービスは最初の3,100通までは無料なので、個人で使う分ではまず大丈夫でしょう。

それ以降も1,000通あたり13円くらいで、安い。

圧倒的にスパム対策にもなるので有効だと思います。

https://www.oracle.com/jp/application-development/email-delivery/

---
### 3. DNS設定
メールサーバー運用においてDNS設定は肝になります。

スパム判定はほぼDNSでされるので、これが無いと届かせるのは難しいでしょう。

設定必須なのは：
- SPF
- DKIM
- DMARC

必要なレコード概要は以下です：

| 名前 | タイプ | 内容 | 用途 |
|---|---|---|---|
| mail.example.com | A | {mailserver-ip} | メールサーバー本体のIP(DNSのみ・プロキシなし) |
| example.com | MX | mail.example.com | メール受信先の指定 |
| mail._domainkey.example.com | TXT | v=DKIM1; h=sha256;... | DKIM公開鍵 |
| example.com | TXT | v=spf1 include:ap.rp... | SPF |
| _dmarc.example.com | TXT | v=DMARC1; p=none... | DMARC |
| webmail.example.com | A | {IMAPserver-ip} | 443指定してウェブ上でメールをみるやつ |

またサブドメインは基本的に任意ですが、慣習でほぼほぼ決まっているようです。

cloudflareではプロキシ噛ませると疎通できなくなるので、ONOFFはきちんとした方がよさそうです

#### SPF
OCIではSPFはregionによって異なります。以下に一覧があるので、そちらを参照してください

日本はアジア太平洋に該当します。

https://docs.oracle.com/ja-jp/iaas/Content/Email/Tasks/configurespf.htm


#### DKIM
また後で設定しまーす

#### DMARC
無くても動きます。送信失敗したときの扱いを表示するものです。

最初はとりあえず`p=none`で大丈夫です

<!-- あとDNSとcertbotでの認証と鯖立て oracleのメール転送と thunderbirdの紹介とか, PTRレコード -->


---
### 4. PTRレコード設定
PTR設定は天下のGoogleでも重要だと明記されているので、DNSくらい重要な指標となるようです。

https://support.google.com/mail/answer/81126?hl=ja

> 重要: 送信元 IP アドレスは、ポインタ（PTR）レコードで指定されたホスト名の IP アドレスと一致している必要があります。

OCIではPTRレコードを申請して登録してもらう必要があるので、サービスとコンタクトを取ります。

OCIコンソール開いて右上の？マーク -> サポート・センターにアクセス -> ヘルプのリクエスト

AIのボットが起動するので、PTR追加したい、みたいなことを言い続けます。

https://docs.oracle.com/ja-jp/iaas/Content/Network/Concepts/reverse_dns.htm

> 2. サービス・リクエストをオープンして、次の情報を含めます:
> 
>     a. PTRに必要なIPアドレスおよび完全修飾ドメイン名(FQDN)。
> 
>     b. ステップ1で作成したフォワード・レコードのFQDN。

`{mailserver-ip}`と`mail.example.com`を提供します。

ボットだと相手にならないので、チケットを発行してもらって人に対応してもらいましょう。

結構ボットはポンコツなので、根気よく相手します。人の返信はこれも3営業日くらいかかると思います。

このPTRレコードの申請はすんなり通りました。

---
### 5. Oracle Email Deliveryサービス設定
#### SMTP証明書
右上のアイコン -> {自分のメールアドレス} -> 保存済みのパスワード

この中にあるSMTP資格証明を使います。

![](/mailserver/image4.png)


資格証明の生成をクリックし生成するとユーザー名とパスワードが表示されます。

これは一度しか表示されないので、必ずコピーして控えておきます。

#### Oracle Email Deliveryサービス本チャン
左上のハンバーガーメニュー -> 開発者サービス -> アプリケーション統合 -> 電子メール配信 -> 承認送信者

アドレスを入力して作成します。作成したアカウント名は控えておきます。

`{name}@example.com`

`contact`とか`info`とかそんなとこでしょうか

![](/mailserver/image5.png)


---
### 6. 鯖立て
やっと鯖を立てます

インスタンスにログインしましょう。

docker-mailserverというものがあるので、これを使うことにします。

composeコマンド一発で立ち上がるので、簡単です

https://github.com/docker-mailserver/docker-mailserver

https://docker-mailserver.github.io/docker-mailserver/latest/


SSL/TLSはcertbotの認証をDNS-01チャレンジを使うことにしました。

認証方式はなんでもいいです。ただイングレス開けるのがくどいのとポート競合とかあるのでDNSの方にしました



#### env設定
`$ mkdir mailserver`

ディレクトリを作成してその中に`mailserver.env`を作成

```env
OVERRIDE_HOSTNAME=mail.example.com
ENABLE_SPAMASSASSIN=1
ENABLE_CLAMAV=1
ENABLE_FAIL2BAN=1
ENABLE_POSTGREY=1
SSL_TYPE=letsencrypt
ENABLE_OPENDKIM=1
ENABLE_OPENDMARC=1
ENABLE_POLICYD_SPF=1

DEFAULT_RELAY_HOST=[smtp.email.ap-tokyo-1.oci.oraclecloud.com]:587
RELAY_USER=ocid1.user.~~~~.so.com
RELAY_PASSWORD=
```

RELAY_USERとRELAY_PASSWORDはさっき控えたものに変えてください

この`ENABLE_*`変数は普通に使う分で最小のサービスのみを立ち上げています。

詳しい変数は↓を参照してください

https://docker-mailserver.github.io/docker-mailserver/latest/config/environment/


#### Cloudflare APIトークン取得
DNSをいじるためのAPIトークンを取得します

https://dash.cloudflare.com/profile/api-tokens

ゾーンDNSを編集するテンプレートがあるので、それでとります

これも一度しか表示されないので、控えておきます


#### certbot, Cloudflareプラグイン
```bash
sudo dnf install -y epel-release
sudo dnf install -y certbot python3-certbot-dns-cloudflare
```

Ubuntuはこれ↓
```bash
sudo apt update
sudo apt install -y certbot python3-certbot-dns-cloudflare
```

#### Cloudflare認証情報の作成
```bash
mkdir ~/.secrets
cat > ~/.secrets/cloudflare.ini <<'EOF'
dns_cloudflare_api_token = (トークン)
EOF
chmod 600 ~/.secrets/cloudflare.ini
```

`~/.secrets/cloudflare.ini`を作成し、トークンを貼ります。

権限を変更しないと蹴られるので、600にします


#### 証明書取得
```bash
sudo certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials ~/.secrets/cloudflare.ini \
  --dns-cloudflare-propagation-seconds 30 \
  -d mail.example.com
```

#### 自動更新
証明書を更新した後それを適用する仕組み入れます

```bash
sudo tee /etc/letsencrypt/renewal-hooks/deploy/mailserver-reload.sh <<'EOF'
#!/bin/bash
docker exec mailserver supervisorctl restart postfix dovecot
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/mailserver-reload.sh
```

更新自体は certbot-renew.timer というsystemdタイマーが自動で走っています。


#### compose設定
`mailserver/` ディレクトリに`docker-compose.yml`を作成

```yaml:docker-compose.yml
services:
  mailserver:
    image: ghcr.io/docker-mailserver/docker-mailserver:latest
    container_name: mailserver
    hostname: mail.example.com
    env_file: mailserver.env
    ports:
      - "25:25"
      - "587:587"
      - "465:465"
      - "993:993"
    volumes:
      - ./mail-data/:/var/mail/
      - ./mail-state/:/var/mail-state/
      - ./mail-logs/:/var/log/mail/
      - ./config/:/tmp/docker-mailserver/
      - /etc/localtime:/etc/localtime:ro
      - /etc/letsencrypt/:/etc/letsencrypt/:ro
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
    networks:
      proxy-net:
        aliases:
          - mail.example.com
networks:
  proxy-net:
    external: true
```


ネットワーク作成
```bash
docker network create proxy-net
```

起動！
```bash
docker compose up
```

ログ確認！
```bash
docker compose logs -f
```


---
### 7. メール初期設定
4で作ったメールアドレスのアカウント登録を行います、パスワードの初期設定が求められるので適当に入力します。

```bash
docker exec -it mailserver setup email add {name}@example.com
docker exec -it mailserver setup config dkim
```


---
### 8. DKIM設定
DKIMレコードが生成されたのでさっき開けてたDNSレコードを登録します

`config/opendkim/keys/example.com/mail.txt`にマウントしてあるファイルを表示

```bash
sudo cat ./config/opendkim/keys/example.com/mail.txt
```

中身は
```
mail._domainkey IN      TXT     ( "v=DKIM1; h=sha256; k=rsa; "
          "p=MI~~~~~AB" )  ; ----- DKIM key mail for example.com
```

こんな感じなので、中のダブルクオーテーションを消して、

```
v=DKIM1; h=sha256; k=rsa; p=MI~~~~~AB
```

これだけに

これを3.のDNS設定で保留していたDKIMのコンテンツとして登録します


---
### 9. メーラー登録
ここで1回送信テストをしてもいいかもしれないです。

今後簡単にテストをするためにメーラー登録をします。

Thunderbirdが最も使いやすいと感じていますが、なんでもいいです。

アカウントを先ほど作成したアカウント名（メールアドレス）とパスワードを入力します

https://www.thunderbird.net/ja/



---
### 10. テスト
まずは自分の適当なアドレスで双方にメールが届くかを確認してみてください。

疎通が取れたらスコアチェックをしましょう

https://mail-tester.com/

ここにアクセスするとメールアドレスが表示されるのでそのアドレス宛にメールを送信します。

件名とコンテンツは入力してください。それもスコアに反映されているようです。

そのあと Then check your score をクリックするとスコアが表示されます。


![](/mailserver/image6.png)


全項目を行った結果9.9まで行けました。これで構築完了です。


---
### 11. roundcube構築
ここは完全に補足です。thunderbirdがあるので正直いらない

ここではroundcubeをやってみます。

https://roundcube.net/

これを設定するにはインバウンド443を開けてください

あとDNS適当にレコード追加

おすすめは`webmail.example.com`


`docker-compose.yml`の`mailserver`と`networks`の間に追加
```yaml:docker-compose.yml
~~~~~

  roundcube:
    image: roundcube/roundcubemail:latest
    container_name: roundcube
    restart: unless-stopped
    environment:
      - ROUNDCUBEMAIL_DEFAULT_HOST=tls://mail.example.com
      - ROUNDCUBEMAIL_DEFAULT_PORT=143
      - ROUNDCUBEMAIL_SMTP_SERVER=tls://mail.example.com
      - ROUNDCUBEMAIL_SMTP_PORT=587
      - ROUNDCUBEMAIL_DB_TYPE=sqlite
      - ROUNDCUBEMAIL_PLUGINS=archive,zipdownload,newmail_notifier
    volumes:
      - ./roundcube-data/db:/var/roundcube/db
      - ./roundcube-data/config:/var/roundcube/config
    networks:
      - proxy-net

  webmail-proxy:
    image: nginx:alpine
    container_name: webmail-proxy
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - ./nginx/webmail.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt/:/etc/letsencrypt/:ro
    networks:
      - proxy-net
    depends_on:
      - roundcube

networks:
  ~~~~~
```

`./mailserver/nginx/webmail.conf` を追加
```conf:webmail.conf
server {
    listen 443 ssl;
    server_name webmail.example.com;

    ssl_certificate /etc/letsencrypt/live/webmail.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/webmail.example.com/privkey.pem;

    location / {
        proxy_pass http://roundcube:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

適当でいいです。SSLはさっきと同じやつを使います。あとこれはCloudflareのプロキシ使ってもいいかも。

![](/mailserver/image7.png)

使い勝手はまずまずです。デフォルトではタブを開かないと飛んでこないのが少し難点


## まとめ
全部やったら結構かかりました。2日くらいかな

動かして2週間くらいたちましたが、特に止まってるとかはなさそうです。

スマホではthunderbirdのアプリが1番使い勝手がよさそうでした。

gmailよりリアルタイム性はなくなり、15分に一度ポーリングで通知を確認するような仕組みっぽいです。


あと過去一長くなっちゃった、読んでくれてありがとう