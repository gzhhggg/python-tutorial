## TORTOISE_ORMの設定情報
# TODO:本番と開発で管理できるようにする
import os

DB_CONFIG = {
    "connections": {
        # "default" は Tortoise-ORM 内で使用する接続名です。
        "default": "mysql://docker:docker@localhost:33071/database"
    },
    "apps": {
        "models": {
            # モデルを定義している Python モジュールへのパス
            "models": [
                # TODO: models/__init__.pyで読み込むように設定する？
                "app.models.client",
                "app.models.project",
                "app.models.member",
                "app.models.admin",
                # "aerich.models",
            ],
            "default_connection": "default",
        },
    },
    "use_tz": True,  # タイムゾーンを設定する場合はTrue
    "timezone": "Asia/Tokyo",
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
