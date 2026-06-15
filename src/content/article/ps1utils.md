---
title: ps1スクリプト忘備
date: 2026-04-13
tags:
  - windows
  - setup
---

## overview

毎回コマンドを思い出しながら打つのが面倒だったので


---
## mount.bat 

wslに物理ドライブをマウント

ps1じゃなくてこれbatです、ps1でも実行できるんかな？試してない

```powershell
wsl --mount \\.\PHYSICALDRIVE1 --bare
wsl --mount \\.\PHYSICALDRIVE1 --partition 2
pause
```

### 仕組みと使い方
これをbatで保存した後にショートカットで結びつけます。ショートカットのプロパティに管理者で実行するみたいなやつあるのでそれにします。

するとショートカットをダブルクリックすると管理者で実行するので、このスクリプトが正常に動作します

マウントが完了すると画面に PHYSICALDRIVE みたいなやつを含んだパスが表示されます。

wslに入ってそこにアクセスするとドライブがWSLから閲覧できます


```powershell
wsl --unmount \\.\PHYSICALDRIVE1

pause
```

アンマウントはこんな感じ？PHYSICALDRIVEの部分は起動したときと同じモノに変更して、同じようにショートカットで保存がおすすめです。



---
## fetch.ps1

SCPコマンドを実行

```powershell
# fetch.ps1
param(
    [Parameter(Mandatory=$true, Position=0)][string]$Target,
    [Parameter(Mandatory=$true, Position=1)][string]$RemotePath
)

$LocalDir = "C:\Users\nishi\Downloads"

scp -r "${Target}:${RemotePath}" "$LocalDir"
```

### 使い方

```powershell
.\fetch.ps1 {ssh-to} {src-path}
```

`ssh-to` にはSSH config に書いてあるホスト名(またはIPアドレス)、`src-path` にはリモート側のパス

`scp -r` で再帰的にコピーするので、ディレクトリごと持ってくることもできます

ダウンロード先は `$LocalDir` で固定しているので、環境に合わせて変えてください、おすすめはダウンロードディレクトリです

---

## forward.ps1

SSHポートフォワーディング

```powershell
param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Target,

    [Parameter(Position = 1)]
    [int]$RemotePort = 80,

    [Parameter(Position = 2)]
    [string]$LocalHost = "localhost"
)

$LocalPort = $RemotePort

Write-Host "Forwarding ${LocalHost}:${LocalPort} -> ${Target}:${RemotePort}"
Write-Host "Press Ctrl+C to stop."

ssh -N -L "${LocalHost}:${LocalPort}:localhost:${RemotePort}" $Target
```

### 使い方

```powershell
# リモートの3000番をローカルの3000番に転送
.\forward.ps1 {ssh-to} 3000

# ローカルの待ち受けアドレスを変えたい場合
.\forward.ps1 {ssh-to} 8080 0.0.0.0
```

`-N` でシェルを開かずにフォワーディングだけ, `-L` のオプションは `ローカルアドレス:ローカルポート:リモート側localhost:リモートポート` の形式です

localport = remoteport にしているので、リモートのポートと同じポートをローカルのポートにバインドできます。直感的ですね。

Ctrl+C で終了、開発サーバ上でしか動いていないWebサービスを手元のブラウザで確認したいときに使えます

---


---

## まとめ

| スクリプト | やること |
|---|---|
| fetch.ps1 | scpでリモートのファイルをローカルに取得 |
| forward.ps1 | SSHポートフォワーディングをワンライナーで |
| mount.ps1 | 管理者権限でWSLに物理ディスクをマウント |

どれも短いが、都度コマンドを組み立てるより楽になった。

---

## contact

`nishima[at]example.com`
