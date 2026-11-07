# astro-participant-auth

参加アプリの認証基盤です。引き渡し、セッション、入場、ログアウト、共有テーブルの参照を提供します。ログイン、パスキー、ユーザー作成は提供しません。

仕様の正本は、この参加アプリの `docs/` です。アクセス制御は `page-access.md`、レイアウトは `layout.md` に記載しています。

認証サーバーの資料は [czbone/astro-user-webauthn2](https://github.com/czbone/astro-user-webauthn2) の [docs/](https://github.com/czbone/astro-user-webauthn2/blob/main/docs/README.md) です。詳細は [確定資料](docs/README.md) にあります。

## 公開 API

| 入口                                 | 内容                                                                |
| ------------------------------------ | ------------------------------------------------------------------- |
| `astro-participant-auth`             | `createParticipantFetch`、`PageAccess`、`roleLabel`                 |
| `astro-participant-auth/integration` | 入場ミドルウェアと4画面を組み込む。設定項目は表示名と任意の `publicPaths` |
| `astro-participant-auth/middleware`  | 入場                                                                |
| `astro-participant-auth/layout`      | 業務画面のヘッダ                                                    |
| `astro-participant-auth/env-check`   | 起動前の環境値チェック                                              |

`astro/app` と `astro/hono` はこのパッケージから import しません。参加アプリが引数で渡します。

## セットアップ

```bash
pnpm install
```

`prepare` が共有4テーブルの Prisma Client を `src/generated/prisma` へ生成します。マイグレーションはありません。

統合テストは、このディレクトリの `.env` に `TEST_DATABASE_URL` があるとき実行します。ひな型は `.env.example` です。

## コマンド

| コマンド                | 説明                                             |
| ----------------------- | ------------------------------------------------ |
| `pnpm test`             | ユニットテスト                                   |
| `pnpm test:integration` | 起動済みの PostgreSQL と Redis への統合テスト    |
| `pnpm test:all`         | ユニットテストのあと統合テスト                   |
| `pnpm db:ensure-test`   | `TEST_DATABASE_URL` のデータベースが存在しない場合に作成する |
| `pnpm db:generate`      | 読み取り用 Prisma Client の生成                  |
| `pnpm lint`             | ESLint                                           |
