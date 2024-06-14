from functools import lru_cache

from app.db import get_jwt_secret_key, GetDB


@lru_cache(maxsize=None)
def get_secret_key():
    with GetDB() as db:
        return get_jwt_secret_key(db)
