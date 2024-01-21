import re
import ssl
import tempfile
# import time
from contextlib import contextmanager
from typing import List

from grpclib.health.v1.health_pb2 import HealthCheckRequest, HealthCheckResponse
from grpclib.health.v1.health_grpc import HealthStub
from grpclib.exceptions import GRPCError
from grpclib.client import Channel
from mnode.service_pb2 import XrayFetchVersionRequest, XrayStartRequest, XrayStopRequest, XrayRestartRequest, XrayFetchVersionRequest
from mnode.service_grpc import XrayServiceStub

from app.xray.config import XRayConfig
from xray_api import XRay as XRayAPI


def string_to_temp_file(content: str):
    file = tempfile.NamedTemporaryFile(mode='w+t')
    file.write(content)
    file.flush()
    return file


class XRayNode:

    def __init__(self,
                 address: str,
                 port: int,
                 api_port: int,
                 ssl_key: str,
                 ssl_cert: str,
                 usage_coefficient: float = 1):

        self.address = address
        self.port = port
        self.api_port = api_port
        self.ssl_key = ssl_key
        self.ssl_cert = ssl_cert
        self.usage_coefficient = usage_coefficient

        self.started = False

        self._keyfile = string_to_temp_file(ssl_key)
        self._certfile = string_to_temp_file(ssl_cert)

        ctx = ssl.create_default_context()# cadata=ssl_cert)
        ctx.load_cert_chain(self._certfile.name, self._keyfile.name)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        self._channel = Channel(self.address, self.port, ssl=ctx)
        self._stub = XrayServiceStub(self._channel)
        self._health = HealthStub(self._channel)
        # self._service = Service()
        self._api = None

    async def is_healthy(self):
        try:
            response = await self._health.Check(HealthCheckRequest())
        except (ConnectionError, GRPCError):
            pass
        else:
            if response.status is HealthCheckResponse.SERVING:
                return True
        return False

    @property
    def api(self):
        return self._api

    def _prepare_config(self, config: XRayConfig):
        for inbound in config.get("inbounds", []):
            streamSettings = inbound.get("streamSettings") or {}
            tlsSettings = streamSettings.get("tlsSettings") or {}
            certificates = tlsSettings.get("certificates") or []
            for certificate in certificates:
                if certificate.get("certificateFile"):
                    with open(certificate['certificateFile']) as file:
                        certificate['certificate'] = [
                            line.strip() for line in file.readlines()
                        ]
                        del certificate['certificateFile']

                if certificate.get("keyFile"):
                    with open(certificate['keyFile']) as file:
                        certificate['key'] = [
                            line.strip() for line in file.readlines()
                        ]
                        del certificate['keyFile']

        return config

    async def fetch_xray_version(self):
        async with self._stub.XrayFetchVersion.open() as stm:
            await stm.send_message(XrayFetchVersionRequest())
            r = await stm.recv_message()
            return r.version

    async def start(self, config: XRayConfig):
        config = self._prepare_config(config)

        json_config = config.to_json()
        async with self._stub.XrayStart.open() as stm:
            await stm.send_message(XrayStartRequest(config=json_config))
            r = await stm.recv_message()
            if r.success is True or r.already_started is True:
                self.started = True
        self._node_cert = ssl.get_server_certificate((self.address, self.port))
        self._node_certfile = string_to_temp_file(self._node_cert)
        # connect to API
        self._api = XRayAPI(
            address=self.address,
            port=self.api_port,
            ssl_cert=self._node_cert,
            ssl_target_name="Gozargah"
        )
        """try:
            grpc.channel_ready_future(self._api._channel).result(timeout=5)
        except grpc.FutureTimeoutError:

            start_time = time.time()
            end_time = start_time + 3  # check logs for 3 seconds
            last_log = ''
            with self.get_logs() as logs:
                while time.time() < end_time:
                    if logs:
                        last_log = logs[-1].strip().split('n')[-1]
                    time.sleep(0.1)

            self.disconnect()

            if re.search(r'[Ff]ailed', last_log):
                raise RuntimeError(last_log)

            raise ConnectionError('Failed to connect to node's API')"""

    async def stop(self):
        async with self._stub.XrayStop.open() as stm:
            await stm.send_message(XrayStopRequest())
            await stm.recv_message()
        # self.remote.stop()
        self.started = False
        self._api = None

    async def restart(self, config: XRayConfig):
        self.started = False
        config = self._prepare_config(config)
        json_config = config.to_json()
        async with self._stub.XrayRestart.open() as stm:
            await stm.send_message(XrayRestartRequest(config=json_config))
            r = await stm.recv_message()
            if r.success is True:
                self.started = True

    @contextmanager
    async def get_logs(self):
        if not self.connected:
            raise ConnectionError("Node is not connected")
        async with self._stub.XrayFetchLogs.open() as stm:
            await stm.send_message(XrayFetchLogsRequest())
            async for l in stm:
                yield l

