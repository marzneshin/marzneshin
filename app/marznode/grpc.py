import asyncio
import atexit
import logging
import ssl
import tempfile

from grpclib import GRPCError
from grpclib.client import Channel
from grpclib.exceptions import StreamTerminatedError
from grpclib.health.v1.health_grpc import HealthStub
from grpclib.health.v1.health_pb2 import HealthCheckResponse, HealthCheckRequest

from .base import MarzNodeBase
from .marznode_grpc import MarzServiceStub
from .marznode_pb2 import UserData, UsersData, Empty, User, Inbound


logger = logging.getLogger(__name__)


def string_to_temp_file(content: str):
    file = tempfile.NamedTemporaryFile(mode='w+t')
    file.write(content)
    file.flush()
    return file


class MarzNodeGRPC(MarzNodeBase):
    def __init__(self, address: str, port: int, ssl_key: str, ssl_cert: str, usage_coefficient: int = 1):
        self._address = address
        self._port = port

        self._keyfile = string_to_temp_file(ssl_key)
        self._certfile = string_to_temp_file(ssl_cert)

        ctx = ssl.create_default_context()  # cadata=ssl_cert)
        ctx.load_cert_chain(self._certfile.name, self._keyfile.name)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self._channel = Channel(self._address, self._port, ssl=ctx)
        self._stub = MarzServiceStub(self._channel)
        self._health = HealthStub(self._channel)
        self._updates_queue = asyncio.Queue(1)
        self.synced = False

        self.usage_coefficient = usage_coefficient
        atexit.register(self._channel.close)

    @staticmethod
    def _catch_connection_problem(func):
        async def catcher(self, *args, **kwargs):
            try:
                await func(self, *args, **kwargs)
            except (OSError, ConnectionError, GRPCError):
                self.synced = False
        return catcher

    async def _stream_user_updates(self):
        try:
            async with self._stub.SyncUsers.open() as stream:
                logger.info("opened the stream")
                while True:
                    user_update = await self._updates_queue.get()
                    logger.info("got something from queue")
                    user = user_update["user"]
                    await stream.send_message(
                        UserData(user=User(id=user.id, username=user.username, key=user.key),
                                 inbounds=[Inbound(tag=t) for t in user_update["inbounds"]]))
        except (OSError, ConnectionError, GRPCError, StreamTerminatedError):
            logger.info("node detached")
            self.synced = False

    async def update_user(self, user, inbounds: set[str] | None = None):
        if inbounds is None:
            inbounds = set()

        if self.synced:
            await self._updates_queue.put({"user": user, "inbounds": inbounds})

    @_catch_connection_problem
    async def repopulate_users(self, users_data: list[dict]) -> None:
        async with self._stub.RepopulateUsers.open() as stream:
            updates = [UserData(user=User(id=u["id"], username=u["username"], key=u["key"]),
                                inbounds=[Inbound(tag=t) for t in u["inbounds"]]) for u in users_data]
            await stream.send_message(UsersData(users_data=updates))

    async def fetch_users_stats(self):
        async with self._stub.FetchUsersStats.open() as stream:
            await stream.send_message(Empty())
            stats = await stream.recv_message()
            return stats.users_stats

    async def fetch_inbounds(self) -> list:
        async with self._stub.FetchInbounds.open() as stm:
            await stm.send_message(Empty())
            inbounds = await stm.recv_message()
        return inbounds.inbounds

    async def is_alive(self) -> bool:
        try:
            response = await self._health.Check(HealthCheckRequest())
        except (OSError, ConnectionError, GRPCError, StreamTerminatedError):
            pass
        else:
            if response.status is HealthCheckResponse.SERVING:
                return True
        return False
