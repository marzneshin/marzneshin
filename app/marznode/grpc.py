from grpclib.client import Channel
from grpclib.health.v1.health_grpc import HealthStub

from .base import MarzNodeBase
from .marznode_grpc import MarzServiceStub
from .marznode_pb2 import UserUpdate, Empty, User


class MarzNodeGRPC(MarzNodeBase):
    def __init__(self, address: str, port: int, ssl_key: str, ssl_cert: str):  # TODO: implement ssl
        self._address = address
        self._port = port
        self._channel = Channel(self.address, self.port)
        self._stub = MarzServiceStub(self._channel)
        self._health = HealthStub(self._channel)

    async def add_user(self, user, inbounds):
        async with self._stub.AddUser.open() as stm:
            await stm.send_message(UserUpdate(user=User(id=user.id, username=user.name, key=user.key),
                                              inbound_additions=[]))
            await stm.recv_message()

    async def remove_user(self, user, inbounds=[]):
        async with self._stub.RemoveUser.open() as stm:
            await stm.send_message(UserUpdate(user=User(id=user.id, username=user.name, key=user.key),
                                              inbound_reductions=[]))
            await stm.recv_message()

    async def update_user_inbounds(self):
        async with self._stub.AddUser.open() as stm:
            await stm.send_message(UserUpdate(user=User(id=user.id, username=user.name, key=user.key),
                                              inbound_additions=[]))
            await stm.recv_message()

    async def repopulate_users(self, users):
        raise NotImplementedError

    async def fetch_users_stats(self):
        raise NotImplementedError

    async def fetch_inbounds(self):
        async with self._stub.AddUser.open() as stm:
            await stm.send_message(Empty)
            await stm.recv_message()
