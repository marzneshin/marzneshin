import grpclib

from .base import XRayBase
from .exceptions import RelatedError
from .proto.app.proxyman.command import command_pb2, command_grpc
from .proto.common.protocol import user_pb2
from .types.account import Account
from .types.message import Message, TypedMessage

#try:
#    from .proto.core import config_pb2 as core_config_pb2
#except ModuleNotFoundError:
#    from .proto import config_pb2 as core_config_pb2


class Proxyman(XRayBase):
    async def alter_inbound(self, tag: str, operation: TypedMessage) -> bool:
        self.create_channel()
        stub = command_grpc.HandlerServiceStub(self._channel)
        try:
            await stub.AlterInbound(command_pb2.AlterInboundRequest(tag=tag, operation=operation))
            return True

        except grpclib.exceptions.GRPCError as e:
            raise RelatedError(e)

    async def alter_outbound(self, tag: str, operation: TypedMessage) -> bool:
        self.create_channel()
        stub = command_grpc.HandlerServiceStub(self._channel)
        try:
            await stub.AlterInbound(command_pb2.AlterOutboundRequest(tag=tag, operation=operation))
            return True

        except grpclib.exceptions.GRPCError as e:
            raise RelatedError(e)

    async def add_inbound_user(self, tag: str, user: Account) -> bool:
        return await self.alter_inbound(
            tag=tag,
            operation=Message(
                command_pb2.AddUserOperation(
                    user=user_pb2.User(
                        level=user.level,
                        email=user.email,
                        account=user.message
                    )
                )
            ))

    async def remove_inbound_user(self, tag: str, email: str) -> bool:
        return await self.alter_inbound(
            tag=tag,
            operation=Message(
                command_pb2.RemoveUserOperation(
                    email=email
                )
            ))

    async def add_outbound_user(self, tag: str, user: Account) -> bool:
        return await self.alter_outbound(
            tag=tag,
            operation=Message(
                command_pb2.AddUserOperation(
                    user=user_pb2.User(
                        level=user.level,
                        email=user.email,
                        account=user.message
                    )
                )
            ))

    async def remove_outbound_user(self, tag: str, email: str) -> bool:
        return await self.alter_outbound(
            tag=tag,
            operation=Message(
                command_pb2.RemoveUserOperation(
                    email=email
                )
            ))

    async def add_inbound(self):
        raise NotImplementedError

    async def remove_inbound(self):
        raise NotImplementedError

    async def add_outbound(self):
        raise NotImplementedError

    async def remove_outbound(self):
        raise NotImplementedError
