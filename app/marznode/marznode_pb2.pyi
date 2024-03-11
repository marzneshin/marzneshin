from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class Empty(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class Inbound(_message.Message):
    __slots__ = ("tag", "config")
    TAG_FIELD_NUMBER: _ClassVar[int]
    CONFIG_FIELD_NUMBER: _ClassVar[int]
    tag: str
    config: str
    def __init__(self, tag: _Optional[str] = ..., config: _Optional[str] = ...) -> None: ...

class InboundsResponse(_message.Message):
    __slots__ = ("inbounds",)
    INBOUNDS_FIELD_NUMBER: _ClassVar[int]
    inbounds: _containers.RepeatedCompositeFieldContainer[Inbound]
    def __init__(self, inbounds: _Optional[_Iterable[_Union[Inbound, _Mapping]]] = ...) -> None: ...

class User(_message.Message):
    __slots__ = ("id", "username", "key")
    ID_FIELD_NUMBER: _ClassVar[int]
    USERNAME_FIELD_NUMBER: _ClassVar[int]
    KEY_FIELD_NUMBER: _ClassVar[int]
    id: int
    username: str
    key: str
    def __init__(self, id: _Optional[int] = ..., username: _Optional[str] = ..., key: _Optional[str] = ...) -> None: ...

class UserData(_message.Message):
    __slots__ = ("user", "inbounds")
    USER_FIELD_NUMBER: _ClassVar[int]
    INBOUNDS_FIELD_NUMBER: _ClassVar[int]
    user: User
    inbounds: _containers.RepeatedCompositeFieldContainer[Inbound]
    def __init__(self, user: _Optional[_Union[User, _Mapping]] = ..., inbounds: _Optional[_Iterable[_Union[Inbound, _Mapping]]] = ...) -> None: ...

class UsersData(_message.Message):
    __slots__ = ("users_data",)
    USERS_DATA_FIELD_NUMBER: _ClassVar[int]
    users_data: _containers.RepeatedCompositeFieldContainer[UserData]
    def __init__(self, users_data: _Optional[_Iterable[_Union[UserData, _Mapping]]] = ...) -> None: ...

class UsersStats(_message.Message):
    __slots__ = ("users_stats",)
    class UserStats(_message.Message):
        __slots__ = ("uid", "usage")
        UID_FIELD_NUMBER: _ClassVar[int]
        USAGE_FIELD_NUMBER: _ClassVar[int]
        uid: int
        usage: int
        def __init__(self, uid: _Optional[int] = ..., usage: _Optional[int] = ...) -> None: ...
    USERS_STATS_FIELD_NUMBER: _ClassVar[int]
    users_stats: _containers.RepeatedCompositeFieldContainer[UsersStats.UserStats]
    def __init__(self, users_stats: _Optional[_Iterable[_Union[UsersStats.UserStats, _Mapping]]] = ...) -> None: ...

class LogLine(_message.Message):
    __slots__ = ("line",)
    LINE_FIELD_NUMBER: _ClassVar[int]
    line: str
    def __init__(self, line: _Optional[str] = ...) -> None: ...

class XrayConfig(_message.Message):
    __slots__ = ("configuration",)
    CONFIGURATION_FIELD_NUMBER: _ClassVar[int]
    configuration: str
    def __init__(self, configuration: _Optional[str] = ...) -> None: ...

class XrayLogsRequest(_message.Message):
    __slots__ = ("include_buffer",)
    INCLUDE_BUFFER_FIELD_NUMBER: _ClassVar[int]
    include_buffer: bool
    def __init__(self, include_buffer: bool = ...) -> None: ...
