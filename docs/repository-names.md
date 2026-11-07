# リポジトリの命名

GitHub の [npomori](https://github.com/npomori) に置くリポジトリの名前と description の規約です。

名前は英小文字のケバブケースにします。フレームワーク名は付けません。description は英語の1文です。

## 固定のリポジトリ

| 役割 | リポジトリ | description |
| --- | --- | --- |
| 参加アプリのベース | `participant-app-base` | Base for participant apps. Provides handoff, session, admission, and logout, and is the starting point for each app's own screens. |
| 認証サーバー | `auth-server` | Auth server for participant apps. Owns login, passkeys, users, and grants, and hands a session to each app. |

このリポジトリを `npomori` へ置くときの名前は `participant-app-base` です。参加アプリは、このベースを継承して作ります。

認証サーバーは1つです。参加アプリごとに複製しません。ログイン、パスキー、ユーザー、付与は認証サーバーが持ちます。

## 参加アプリ

参加アプリの名前は、そのアプリが扱う業務に `-app` を付けたものです。`participant` はベースの名前だけに使います。

description は次の形です。

```text
Participant app for {対象}. Admits signed-in users and provides the {対象} screens for each role.
```

リポジトリは業務ごとに1つ作ります。管理者と会員のような権限の違いでは分けません。権限による画面の分岐は、1つのアプリ内で実装します。

## 例

| リポジトリ | description |
| --- | --- |
| `news-app` | Participant app for member news. Admits signed-in users and provides the news screens for each role. |
| `activities-app` | Participant app for activity records. Admits signed-in users and provides the activity screens for each role. |
| `events-app` | Participant app for events. Admits signed-in users and provides the event screens for each role. |
| `articles-app` | Participant app for articles. Admits signed-in users and provides the article screens for each role. |
