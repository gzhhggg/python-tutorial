# fast_api を使った darkside アプリ作成

後で整理する！！

## python 関係ない個人メモ(後で消す)

md プレビューショートカット
`cmd + k → v`

## ディレクトリ構想（どうするか検討中）

とりあえず下記で実装してみる
参考：https://zenn.dev/dencyu/articles/a94928b9ce45f7
参考公式：https://fastapi.tiangolo.com/ja/tutorial/sql-databases/#file-structure

```
fast-api-darkside/
│
├── app/
│ ├── **init**.py
│ ├── main.py # FastAPI アプリケーションとルーティング
│ ├── models/ # Tortoise ORM モデル
│ │ ├── **init**.py
│ │ ├── clients.py
│ │ ├── members.py
│ │ ├── projects.py
│ │ └── ... # その他のモデル
│ ├── schemas/ # Pydantic スキーマ
│ │ ├── **init**.py
│ │ ├── clients.py
│ │ ├── members.py
│ │ ├── projects.py
│ │ └── ... # その他のスキーマ
│ ├── routers/ # ルーティングモジュール
│ │ ├── **init**.py
│ │ ├── clients.py
│ │ ├── members.py
│ │ ├── projects.py
│ │ └── ... # その他のルーター
│ ├── cruds/ # crud モジュール
│ │ ├── **init**.py
│ │ ├── clients.py
│ │ ├── members.py
│ │ ├── projects.py
│ │ └── ... # その他のルーター
│ └── config.py # 設定ファイル（DB 設定含む）
│
├── migrations/ # マイグレーションファイル
├── tests/ # テストケース
├── .env # 環境変数と設定値
├── pyproject.toml # poetry 依存関係と設定
└── README.md # プロジェクトの説明
```

### models

app/models ディレクトリ内に、ER 図に基づいて各テーブルのモデルを定義する。
Tortoise ORM を使うよ
データベースのテーブルをモデル化するためのデータモデル（Tortoise-ORM のモデルなど）を含むディレクトリ。
データベースのテーブルやデータ構造を Python のクラスとして表現し、データベースとの対話やデータの操作を行うためのモデルを定義する。
これらのモデルはデータベースのテーブルと 1 対 1 で対応し、データの取得、作成、更新、削除などの操作を提供する

### schemas

app/schemas ディレクトリ内に、リクエストとレスポンスのデータ構造を定義する
FastAPI のスキーマなので DB スキーマとは別物
リクエストとレスポンスのデータの形式を定義し、データの妥当性を検証するために使用される。
Pydantic スキーマを使用することで、リクエストデータのバリデーションやレスポンスデータのシリアライズ/デシリアライズが行える。

### routers

app/routers ディレクトリ内に、それぞれのモデルに対する CRUD 操作を行うためのルーターを定義する
API のエンドポイントを定義し、リクエストを処理してレスポンスを生成するための FastAPI ルーターを含むディレクトリ。
FastAPI のルーターは、異なるエンドポイントを定義し、リクエストを処理してクライアントに対するレスポンスを生成する

### cruds

ビジネスロジックやデータベース操作を抽象化し、CRUD（作成、読み取り、更新、削除）操作を提供するモジュールを含むディレクトリ。
データベース操作に関連するビジネスロジックを独立したモジュールとして切り出し、データベースの操作をより再利用可能な形で提供する。
CRUD 操作は、モデルとデータベースの間のインターフェースとして機能し、エンドポイント内で利用される。

## poetry コマンド

仮想環境作成
`poetry init`

仮想環境に入る
`poetry shell`

poetry でライブラリのインストール

```
poetry add fastapi
poetry add fastapi-admin
poetry add tortoise-orm
```

poerty で追加したライブラリ達

```
poetry add aiomysql
poetry add aerich
poetry add email-validator
poetry add uvicorn
# MySQLデータベースへの接続時に使用される認証方法
pip install cryptography
```

仮想環境に入っているか確認

```
echo $VIRTUAL_ENV
/Users/adachikeiichi/Documents/python/python-turorial/fast-api-darkside/.venv
```

## その他

uvicorn で fastapi を起動
`uvicorn app.main:app --reload`

### Tortoise-ORM について

#### Tortoise-ORM と SQLAlchemy の違いとそれぞれの利点

SQLAlchemy
歴史と成熟度: SQLAlchemy は長い歴史を持ち、Python で最も成熟して使用されている ORM の一つです。多くの本番環境での使用実績があります。
同期/非同期サポート: 元々は同期オペレーション用に設計されていますが、SQLAlchemy 1.4 からは非同期サポートが導入され、FastAPI と組み合わせて非同期で使用することができます。
柔軟性と機能性: 高度なクエリ構築、複雑なリレーションシップマッピング、マイグレーションサポート（Alembic を通じて）など、豊富な機能を提供します。

Tortoise-ORM
非同期ネイティブ: Tortoise-ORM は非同期 IO を前提として設計されており、FastAPI などの非同期フレームワークと自然に統合されます。
シンプルでモダン: Django の ORM にインスパイアされた API を持ち、Python の非同期機能とモダンな開発要件に適応しています。
簡潔さと使いやすさ: Tortoise-ORM は使いやすさを重視しており、設定やボイラープレートコードが少ないため、プロジェクトのセットアップがシンプルになります。

今回は高度なデータベース操作は必要ないので、簡単に非同期処理できる Tortoise-ORM を使うんだろう。。

### マイグレーション

Tortoise-ORM では、aerich というマイグレーションツールを使用してマイグレーションを管理し、マイグレーションの履歴を残すことができる。
aerich は Tortoise-ORM のためのマイグレーションツールであり、モデルの変更を追跡し、データベーススキーマのマイグレーションを行うことができるので導入する。
→ なんかエラー発生するのでやめる

### データベース接続情報

将来的には、dotenv ライブラリとか使用して本番・開発で管理する

### 細かいこと

## 問題

fastapi-admin と pytest では distutils が必要になる

python3.12 では標準モジュールの distutils が存在しないため、エラーが発生する
distutils は python プロジェクトのビルド、配布、インストールを容易にする

```
  from distutils.version import StrictVersion
ModuleNotFoundError: No module named 'distutils'
line 90, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
```

エラーが発生する条件： - pytest でエラーが発生する - fastapi-admin でエラーが発生する（aioredis を使用するときにエラーが発生するみたい） - distutils は 非推奨で、Python 3.12 での除去が予定されている
[distutils に関する公式ドキュメント](https://docs.python.org/ja/3.10/library/distutils.html#module-distutils)

対策：バージョン下げる 3.11 系が優秀という記事があったので一旦 3.11 で起動する

python のバージョン下げる方法

```
## 仮想環境に入っている場合は一旦抜ける
deactivate

## 仮想環境を削除
rm -rf .venv/

asdf install python 3.11.7

## python3.11.7でpoetryをインストール
pip install poetry

rm poetry.lock
rm pyproject.toml

poetry init

## 仮想環境に再度入る
poetry shell
```

aioredis が python3.11.7 でもサポートされてなかった。。。
aioredis とは：Redis データベースと非同期に通信するためのライブラリです
https://github.com/aio-libs-abandoned/aioredis-py

というわけで別のライブラリを探す。
fastapi-admin の公式では aioredis を使っている
3.11 でもダメかもしれない
https://github.com/fastapi-admin/fastapi-admin/issues/138

fastapi admin が内部的に aioredis を使っていますので
これじゃ無理ー

3.10 系に下げるしかない。