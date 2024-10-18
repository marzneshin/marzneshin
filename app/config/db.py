from aiocache import cached, Cache

from app.db import get_jwt_secret_key, get_db_session


@cached(cache=Cache.MEMORY)
async def get_secret_key():
    async for db in get_db_session():
        return await get_jwt_secret_key(db)
