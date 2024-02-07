from grpclib.client import Channel
from grpclib.health.v1.health_grpc import HealthStub

from .base import MarzNodeBase
from .marznode_grpc import MarzServiceStub
from .marznode_pb2 import UserUpdate, Empty, User, Inbound


class MarzNodeGRPC(MarzNodeBase):
    def __init__(self, address: str, port: int, ssl_key: str, ssl_cert: str):  # TODO: implement ssl
        self._address = address
        self._port = port
        self._channel = Channel(self._address, self._port)
        self._stub = MarzServiceStub(self._channel)
        self._health = HealthStub(self._channel)

    async def add_user(self, user, inbounds: list[str] | None = None) -> None:
        if inbounds is None:
            inbounds = []

        async with self._stub.AddUser.open() as stm:
            await stm.send_message(UserUpdate(user=User(id=user.id, username=user.username, key=user.key),
                                              inbound_additions=[Inbound(tag=i) for i in inbounds]))
            await stm.recv_message()

    async def remove_user(self, user, inbounds: list[str] | None = None) -> None:
        if inbounds is None:
            inbounds = []
        async with self._stub.RemoveUser.open() as stm:
            await stm.send_message(UserUpdate(user=User(id=user.id, username=user.username, key=user.key),
                                              inbound_reductions=[Inbound(tag=i) for i in inbounds]))
            await stm.recv_message()

    async def update_user_inbounds(self, user,
                                   inbound_additions: list[str] | None = None,
                                   inbound_reductions: list[str] | None = None) -> None:
        if inbound_reductions is None:
            inbound_reductions = []
        if inbound_additions is None:
            inbound_additions = []

        async with self._stub.UpdateUserInbounds.open() as stm:
            await stm.send_message(UserUpdate(user=User(id=user.id, username=user.username, key=user.key),
                                              inbound_additions=[Inbound(tag=i) for i in inbound_additions],
                                              inbound_reductions=[Inbound(tag=i) for i in inbound_reductions]))
            await stm.recv_message()

    async def repopulate_users(self, users):
        raise NotImplementedError

    async def fetch_users_stats(self):
        raise NotImplementedError

    async def fetch_inbounds(self):
        async with self._stub.FetchInbounds.open() as stm:
            await stm.send_message(Empty)
            await stm.recv_message()
