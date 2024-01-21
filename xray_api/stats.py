import typing
from dataclasses import dataclass

import grpclib

from .base import XRayBase
from .exceptions import RelatedError
from .proto.app.stats.command import command_pb2, command_grpc


@dataclass
class SysStatsResponse:
    num_goroutine: int
    num_gc: int
    alloc: int
    total_alloc: int
    sys: int
    mallocs: int
    frees: int
    live_objects: int
    pause_total_ns: int
    uptime: int


@dataclass
class StatResponse:
    name: str
    type: str
    link: str
    value: int


@dataclass
class UserStatsResponse:
    email: str
    uplink: int
    downlink: int


@dataclass
class InboundStatsResponse:
    tag: str
    uplink: int
    downlink: int


@dataclass
class OutboundStatsResponse:
    tag: str
    uplink: int
    downlink: int


class Stats(XRayBase):
    async def get_sys_stats(self) -> SysStatsResponse:
        self.create_channel()
        try:
            stub = command_grpc.StatsServiceStub(self._channel)
            r = await stub.GetSysStats(command_pb2.SysStatsRequest())

        except grpclib.exceptions.GRPCError as e:
            raise RelatedError(e)

        return SysStatsResponse(
            num_goroutine=r.NumGoroutine,
            num_gc=r.NumGC,
            alloc=r.Alloc,
            total_alloc=r.TotalAlloc,
            sys=r.Sys,
            mallocs=r.Mallocs,
            frees=r.Frees,
            live_objects=r.LiveObjects,
            pause_total_ns=r.PauseTotalNs,
            uptime=r.Uptime
        )

    async def query_stats(self, pattern: str, reset: bool = False) -> typing.Iterable[StatResponse]:
        self.create_channel()
        try:
            stub = command_grpc.StatsServiceStub(self._channel)
            r = await stub.QueryStats(command_pb2.QueryStatsRequest(pattern=pattern, reset=reset))

        except grpclib.exceptions.GRPCError as e:
            raise RelatedError(e)
        results = []
        for stat in r.stat:
            typ, name, _, link = stat.name.split('>>>')
            results.append(StatResponse(name, typ, link, stat.value))
        return results

    async def get_users_stats(self, reset: bool = False) -> typing.Iterable[StatResponse]:
        return await self.query_stats("user>>>", reset=reset)

    async def get_inbounds_stats(self, reset: bool = False) -> typing.Iterable[StatResponse]:
        return await self.query_stats("inbound>>>", reset=reset)

    async def get_outbounds_stats(self, reset: bool = False) -> typing.Iterable[StatResponse]:
        return await self.query_stats("outbound>>>", reset=reset)

    async def get_user_stats(self, email: str, reset: bool = False) -> typing.Iterable[StatResponse]:
        uplink, downlink = 0, 0
        for stat in await self.query_stats(f"user>>>{email}>>>", reset=reset):
            if stat.link == 'uplink':
                uplink = stat.value
            if stat.link == 'downlink':
                downlink = stat.value

        return UserStatsResponse(email=email, uplink=uplink, downlink=downlink)

    async def get_inbound_stats(self, tag: str, reset: bool = False) -> typing.Iterable[StatResponse]:
        uplink, downlink = 0, 0
        for stat in await self.query_stats(f"inbound>>>{tag}>>>", reset=reset):
            if stat.link == 'uplink':
                uplink = stat.value
            if stat.link == 'downlink':
                downlink = stat.value
        return InboundStatsResponse(tag=tag, uplink=uplink, downlink=downlink)

    async def get_outbound_stats(self, tag: str, reset: bool = False) -> typing.Iterable[StatResponse]:
        uplink, downlink = 0, 0
        for stat in await self.query_stats(f"outbound>>>{tag}>>>", reset=reset):
            if stat.link == 'uplink':
                uplink = stat.value
            if stat.link == 'downlink':
                downlink = stat.value
        return OutboundStatsResponse(tag=tag, uplink=uplink, downlink=downlink)
