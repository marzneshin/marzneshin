import atexit
import ssl
import tempfile

from grpclib import GRPCError
from grpclib.client import Channel
from grpclib.health.v1.health_grpc import HealthStub
from grpclib.health.v1.health_pb2 import HealthCheckResponse, HealthCheckRequest

from .base import MarzNodeBase
from .marznode_grpc import MarzServiceStub
from .marznode_pb2 import UserUpdate, UsersUpdate, Empty, User, Inbound


def string_to_temp_file(content: str):
    file = tempfile.NamedTemporaryFile(mode='w+t')
    file.write(content)
    file.flush()
    return file


class MarzNodeGRPC(MarzNodeBase):
    def __init__(self, address: str, port: int, ssl_key: str, ssl_cert: str):  # TODO: implement ssl
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
        atexit.register(self._channel.close)

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

    async def repopulate_users(self, user_updates: list[dict]) -> None:
        async with self._stub.RepopulateUsers.open() as stream:
            updates = [UserUpdate(user=User(id=u["id"], username=u["username"], key=u["key"]),
                                  inbound_additions=[Inbound(tag=t) for t in u["inbounds"]]) for u in user_updates]
            await stream.send_message(UsersUpdate(users_updates=updates))

    async def fetch_users_stats(self):
        raise NotImplementedError

    async def fetch_inbounds(self) -> list:
        async with self._stub.FetchInbounds.open() as stm:
            await stm.send_message(Empty())
            inbounds = await stm.recv_message()
        return inbounds.inbounds

    async def is_alive(self) -> bool:
        try:
            response = await self._health.Check(HealthCheckRequest())
        except (ConnectionError, GRPCError):
            pass
        else:
            if response.status is HealthCheckResponse.SERVING:
                return True
        return False
