import contextlib
from typing import Any, AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base

from app.config.env import (
    SQLALCHEMY_DATABASE_URL,
    SQLALCHEMY_CONNECTION_POOL_SIZE,
    SQLALCHEMY_CONNECTION_MAX_OVERFLOW,
    DEBUG,
)

Base = declarative_base()


class DatabaseSessionManager:
    def __init__(
        self, host: str, engine_kwargs: dict[str, Any] = {}, echo=DEBUG
    ):
        self._engine = create_async_engine(host, **engine_kwargs, echo=echo)
        self._sessionmaker = async_sessionmaker(
            autocommit=False, bind=self._engine
        )

    async def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()

        self._engine = None
        self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise
            finally:
                await connection.close()

    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_kwargs = {"connect_args": {"check_same_thread": False}}
else:
    engine_kwargs = {
        "pool_size": SQLALCHEMY_CONNECTION_POOL_SIZE,
        "max_overflow": SQLALCHEMY_CONNECTION_MAX_OVERFLOW,
        "pool_recycle": 3600,
        "pool_timeout": 10,
        "pool_pre_ping": True,
    }

sessionmanager = DatabaseSessionManager(SQLALCHEMY_DATABASE_URL, engine_kwargs)


async def get_db_session():
    async with sessionmanager.session() as session:
        yield session
