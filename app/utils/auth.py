from datetime import datetime, timedelta, timezone
from functools import lru_cache
from typing import Union

import jwt
from jwt import InvalidTokenError

from app.db import GetDB, get_jwt_secret_key
from config import JWT_ACCESS_TOKEN_EXPIRE_MINUTES


@lru_cache(maxsize=None)
def get_secret_key():
    with GetDB() as db:
        return get_jwt_secret_key(db)


def create_token(username: str, is_sudo=False, token_type="access"):
    data = {
        "sub": username,
        "iat": datetime.now(timezone.utc),
        "nbf": datetime.now(timezone.utc),
        "access": "sudo" if is_sudo else "admin",
        "type": token_type,
    }
    if JWT_ACCESS_TOKEN_EXPIRE_MINUTES > 0:
        data["exp"] = datetime.now(timezone.utc) + timedelta(
            minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        )
    encoded_jwt = jwt.encode(data, get_secret_key(), algorithm="HS256")
    return encoded_jwt


def create_access_token(username: str, is_sudo=False) -> str:
    return create_token(username, is_sudo)


def create_refresh_token(username: str, is_sudo=False) -> str:
    return create_token(username, is_sudo, "refresh")


def get_admin_payload(token: str) -> Union[dict, None]:
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=["HS256"])
    except InvalidTokenError:
        return

    username: str = payload.get("sub")
    access: str = payload.get("access")
    if not username or access not in ("admin", "sudo"):
        return
    try:
        created_at = datetime.fromtimestamp(payload["iat"], timezone.utc)
    except KeyError:
        created_at = None

    return {
        "username": username,
        "is_sudo": access == "sudo",
        "created_at": created_at,
        "type": payload.get("type"),
    }
