# Punk Ideas API

[Punk Ideas](https://github.com/MihiroH/punk-ideas)のAPIサーバーです。

## 技術スタック

| 名称       | 説明                         | URL                                               |
| ---------- | ---------------------------- | ------------------------------------------------- |
| NestJS     | Node.jsフレームワーク        | https://nestjs.com/                               |
| Prisma     | ORM                          | https://www.prisma.io/                            |
| Snaplet    | データベースシード管理ツール | https://docs.snaplet.dev/seed/integrations/prisma |
| Biome      | コードフォーマット & Lint    | https://biomejs.dev/                              |

## セットアップ

### 環境変数の設定

```bash
$ cp .env.example .env
```

### docker containerの起動

```bash
$ docker compose up -d
```

### npmパッケージのインストール

`--force`オプションをつけている理由は、自身のマシンと異なるプラットフォームのバイナリをダウンロードする際の警告を無視するためです。  

参考文献:  
https://unit-code.com/js/react/nextjs/biome-installation/  
https://biomejs.dev/ja/reference/vscode/#%E3%83%88%E3%83%A9%E3%83%96%E3%83%AB%E3%82%B7%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0

```bash
$ npm install --force
```

### DBのセットアップ

```bash
# ローカル環境
$ npm run migrate:dev
$ npm run postmigrate
$ npm run db:seed:dev

# 本番環境
$ npm run migrate
```

## Webサーバー起動

```bash
# ローカル環境
$ npm run start

# ローカル環境(watchモード)
$ npm run start:dev

# 本番環境
$ npm run start:prod
```

## コードフォーマット & Lint

```bash
# .prismaファイルのフォーマット(by Prisma)
$ npm run format:prisma

# それ以外のファイルのフォーマット(by Biome)
$ npm run format

# Lint(by Biome)
$ npm run lint

# フォーマット & Lint(by Biome)
$ npm run check
```
