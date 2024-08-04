from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class ConfigFormat(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    PLAIN: _ClassVar[ConfigFormat]
    JSON: _ClassVar[ConfigFormat]
    YAML: _ClassVar[ConfigFormat]
PLAIN: ConfigFormat
JSON: ConfigFormat
YAML: ConfigFormat

class Empty(_message.Message):
    __slots__ = ()
    def __init__(self) -> None: ...

class Backend(_message.Message):
    __slots__ = ("name", "type", "version", "inbounds")
    NAME_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    VERSION_FIELD_NUMBER: _ClassVar[int]
    INBOUNDS_FIELD_NUMBER: _ClassVar[int]
    name: str
    type: str
    version: str
    inbounds: _containers.RepeatedCompositeFieldContainer[Inbound]
    def __init__(self, name: _Optional[str] = ..., type: _Optional[str] = ..., version: _Optional[str] = ..., inbounds: _Optional[_Iterable[_Union[Inbound, _Mapping]]] = ...) -> None: ...

class BackendsResponse(_message.Message):
    __slots__ = ("backends",)
    BACKENDS_FIELD_NUMBER: _ClassVar[int]
    backends: _containers.RepeatedCompositeFieldContainer[Backend]
    def __init__(self, backends: _Optional[_Iterable[_Union[Backend, _Mapping]]] = ...) -> None: ...

class Inbound(_message.Message):
    __slots__ = ("tag", "config")
    TAG_FIELD_NUMBER: _ClassVar[int]
    CONFIG_FIELD_NUMBER: _ClassVar[int]
    tag: str
    config: str
    def __init__(self, tag: _Optional[str] = ..., config: _Optional[str] = ...) -> None: ...

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

class BackendConfig(_message.Message):
    __slots__ = ("configuration", "config_format")
    CONFIGURATION_FIELD_NUMBER: _ClassVar[int]
    CONFIG_FORMAT_FIELD_NUMBER: _ClassVar[int]
    configuration: str
    config_format: ConfigFormat
    def __init__(self, configuration: _Optional[str] = ..., config_format: _Optional[_Union[ConfigFormat, str]] = ...) -> None: ...

class BackendLogsRequest(_message.Message):
    __slots__ = ("backend_name", "include_buffer")
    BACKEND_NAME_FIELD_NUMBER: _ClassVar[int]
    INCLUDE_BUFFER_FIELD_NUMBER: _ClassVar[int]
    backend_name: str
    include_buffer: bool
    def __init__(self, backend_name: _Optional[str] = ..., include_buffer: bool = ...) -> None: ...

class RestartBackendRequest(_message.Message):
    __slots__ = ("backend_name", "config")
    BACKEND_NAME_FIELD_NUMBER: _ClassVar[int]
    CONFIG_FIELD_NUMBER: _ClassVar[int]
    backend_name: str
    config: BackendConfig
    def __init__(self, backend_name: _Optional[str] = ..., config: _Optional[_Union[BackendConfig, _Mapping]] = ...) -> None: ...

class BackendStats(_message.Message):
    __slots__ = ("running",)
    RUNNING_FIELD_NUMBER: _ClassVar[int]
    running: bool
    def __init__(self, running: bool = ...) -> None: ...
