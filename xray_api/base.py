import grpclib
# import asyncio
# import functools
import ssl

class XRayBase(object):
    def __init__(self, address: str, port: int, ssl_cert: str = None, ssl_target_name: str = None):
        self.ssl_context = None
        if ssl_cert:
            self.ssl_context = ssl.create_default_context(cadata=ssl_cert)
            self.ssl_context.check_hostname = False
        self._channel = None
        self.address = address
        self.port = port

    def create_channel(self):
        if not self._channel:
            self._channel = grpclib.client.Channel(self.address, self.port, ssl=self.ssl_context)
