---
title: "Wi-Fi自動ミュート機能を実装しよう"
date: 2026-05-06
tags:
  - automation
  - windows
  - powershell
---

## こんにちは
外出先で使うノートパソコンを家でも使う人たくさんいると思います。

特に私みたいな学生なんかは家で動画見てそのまま学校へ、開いた瞬間千鳥の「ちょっと待てぃ!!」が教室中に響きわたることは避けたいものです。

そんなひやひやを解消するためにシステムを作りました。ボリュームとしては10分くらいでできるものなのでやってみて損はないと思います。


## 概要

1. NirCmd でミュート制御
2. PowerShellスクリプト でSSIDを判定
3. タスクスケジューラ でWi-Fi接続イベントをトリガーに自動実行



## 1. NirCmdを用意する
NircmdはWindowsのコマンドラインからいろんな設定を変更できる実行ファイルです。本来ならばCとかC#で制御するものを一括してまとめてくれてるんだと思います。

[NirSoft公式サイト](https://www.nirsoft.net/utils/nircmd.html) から nircmd.exe をダウンロードして実行します。

ダイアログが表示されるので「Copy To Windows Directory」をクリックしてください。 `C:\Windows\System32` にコピーされます。


## 2. PowerShellスクリプトを作成する

以下の内容を `C:\Users\<ユーザー名>\<任意のパス>\wifi-mute.ps1` として保存します。

```powershell
$whitelist = @("許可するSSID1", "許可するSSID2")

$ssid = (Get-NetConnectionProfile).Name

if ($whitelist -contains $ssid) {
    nircmd mutesysvolume 0   # ミュート解除
} else {
    nircmd mutesysvolume 1   # ミュート
}
```

`$whitelist` にミュートしたくないSSIDを列挙します。

作成したら右クリックして「powershellで実行する」で試してみてくださいねー

## 3. WLANイベントログを有効にする

タスクスケジューラのイベントトリガーを使うには、対象のログが有効になっている必要があります。

1. `eventvwr.exe` を開きます
2. 「アプリケーションとサービス ログ」→「Microsoft」→「Windows」→「WLAN-AutoConfig」→「Operational」
3. 右クリック →「ログを有効にする」



## 4. タスクスケジューラにタスクを登録する

1. `taskschd.msc` を開く
2. 「タスクの作成」をクリック
3. 以下のように設定する


### 基本タスクの作成
名前を適当に入力（例: wifi-mute）

### トリガータブ
「特定イベントのログへの記録時」を選択

**ログ**: Microsoft-Windows-WLAN-AutoConfig/Operational

**ソース**: WLAN-AutoConfig

**イベントID**: 8001

### 操作
「プログラムの開始」を選択

**プログラム/スクリプト**
```
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
```

**引数:**
```
-ExecutionPolicy Bypass -NonInteractive -WindowStyle Hidden -File C:\Users\<ユーザー名>\<任意のパス>\wifi-mute.ps1
```

### 確認
完了をクリック！

## 5. プロパティを変更する
作成した後必ずプロパティを変更します。このままだと発火しません。

まず全般タブにある最上位の特権で実行するをオン

![全般タブ](/wifi-mute/image2.png)

次、条件タブのコンピュータをAC電源で使用している場合のみタスクを開始するをオフに
![条件タブ](/wifi-mute/image1.png)

このチェックが入ったままだとバッテリー駆動中にタスクが発火しません。


## 動作確認

Wi-Fiを一度切断して再接続します。ホワイトリストにないSSIDで接続した場合はミュートされ、ホワイトリスト内のSSIDで接続した場合はミュートが解除されます。


## おわり
なにげに外出先で焦ることがなくなるので自分ではよかったかなーと思います✨✨