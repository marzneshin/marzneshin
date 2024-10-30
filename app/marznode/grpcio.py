import asyncio
import atexit
import logging

from _testcapi import INT_MAX
from grpc import ChannelConnectivity, RpcError
from grpc.aio import insecure_channel

from .base import MarzNodeBase
from .database import MarzNodeDB
from .marznode_pb2 import (
    UserData,
    UsersData,
    Empty,
    User,
    Inbound,
    BackendLogsRequest,
    RestartBackendRequest,
    BackendConfig,
    Backend,
    BackendStats,
)
from .marznode_pb2_grpc import MarzServiceStub
from ..models.node import NodeStatus

logger = logging.getLogger(__name__)

channel_options = [
    ("grpc.keepalive_time_ms", 8000),
    ("grpc.keepalive_timeout_ms", 5000),
    ("grpc.http2.max_pings_without_data", 0),
    ("grpc.keepalive_permit_without_calls", 1),
    ("grpc.max_connection_idle_ms", INT_MAX),
    ("grpc.client_idle_timeout_ms", INT_MAX),
    ("grpc.max_connection_age_ms", INT_MAX),
]


class MarzNodeGRPCIO(MarzNodeBase, MarzNodeDB):
    def __init__(
        self, node_id: int, address: str, port: int, usage_coefficient: int = 1
    ):
        self.id = node_id
        self._address = address
        self._port = port

        self._channel = insecure_channel(
            f"{self._address}:{self._port}", channel_options
        )
        self._stub = MarzServiceStub(self._channel)
        self._monitor_task = asyncio.create_task(self._monitor_channel())
        self._streaming_task = None

        self._updates_queue = asyncio.Queue(5)
        self.synced = False
        self.usage_coefficient = usage_coefficient
        atexit.register(self._close_channel)

    async def stop(self):
        await self._channel.close()
        self._monitor_task.cancel()

    def _close_channel(self):
        asyncio.run(self._channel.close())

    async def _monitor_channel(self):
        try:
            await asyncio.wait_for(self._channel.channel_ready(), timeout=5)
        except TimeoutError:
            logger.info("timeout for node, id: %i", self.id)
            self.set_status(NodeStatus.unhealthy, "timeout")
        while state := self._channel.get_state():
            logger.debug("node %i state: %s", self.id, state.value)
            try:
                if state != ChannelConnectivity.READY:
                    raise RpcError
                await self._sync()
                self._streaming_task = asyncio.create_task(
                    self._stream_user_updates()
                )
            except RpcError:
                self.synced = False
                self.set_status(NodeStatus.unhealthy)
                if self._streaming_task:
                    self._streaming_task.cancel()
            else:
                self.set_status(NodeStatus.healthy)
                logger.info("Connected to node %i", self.id)

            await self._channel.wait_for_state_change(state)

    async def _stream_user_updates(self):
        logger.debug("opened the stream")
        stream = self._stub.SyncUsers()
        while True:
            user_update = await self._updates_queue.get()
            logger.debug("got something from queue")
            user = user_update["user"]
            try:
                await stream.write(
                    UserData(
                        user=User(
                            id=user.id, username=user.username, key=user.key
                        ),
                        inbounds=[
                            Inbound(tag=t) for t in user_update["inbounds"]
                        ],
                    )
                )
            except RpcError:
                self.synced = False
                self.set_status(NodeStatus.unhealthy)
                return

    async def update_user(self, user, inbounds: set[str] | None = None):
        if inbounds is None:
            inbounds = set()

        await self._updates_queue.put({"user": user, "inbounds": inbounds})

    async def _repopulate_users(self, users_data: list[dict]) -> None:
        updates = [
            UserData(
                user=User(id=u["id"], username=u["username"], key=u["key"]),
                inbounds=[Inbound(tag=t) for t in u["inbounds"]],
            )
            for u in users_data
        ]
        await self._stub.RepopulateUsers(UsersData(users_data=updates))

    async def fetch_users_stats(self):
        response = await self._stub.FetchUsersStats(Empty())
        return response.users_stats

    async def _fetch_backends(self) -> list:
        response = await self._stub.FetchBackends(Empty())
        return response.backends

    async def _sync(self):
        backends = await self._fetch_backends()
        self.store_backends(backends)
        users = self.list_users()
        await self._repopulate_users(users)
        self.synced = True

    async def get_logs(self, name: str = "xray", include_buffer=True):
        async for response in self._stub.StreamBackendLogs(
            BackendLogsRequest(
                backend_name=name, include_buffer=include_buffer
            )
        ):
            yield response.line

    async def restart_backend(
        self, name: str, config: str, config_format: int
    ):
        try:
            await self._stub.RestartBackend(
                RestartBackendRequest(
                    backend_name=name,
                    config=BackendConfig(
                        configuration=config, config_format=config_format
                    ),
                )
            )
            await self._sync()
        except RpcError:
            self.synced = False
            self.set_status(NodeStatus.unhealthy)
            raise
        else:
            self.set_status(NodeStatus.healthy)

    async def get_backend_config(self, name: str = "xray"):
        response = await self._stub.FetchBackendConfig(Backend(name=name))
        return response.configuration, response.config_format

    async def get_backend_stats(self, name: str):
        response: BackendStats = await self._stub.GetBackendStats(
            Backend(name=name)
        )
        return response
