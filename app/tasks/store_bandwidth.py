import psutil

from app.utils.system import rt_bw


def record_realtime_bandwidth() -> None:
    io = psutil.net_io_counters()
    rt_bw.incoming_bytes, rt_bw.bytes_recv = io.bytes_recv - rt_bw.bytes_recv, io.bytes_recv
    rt_bw.outgoing_bytes, rt_bw.bytes_sent = io.bytes_sent - rt_bw.bytes_sent, io.bytes_sent
    rt_bw.incoming_packets, rt_bw.packets_recv = io.packets_recv - rt_bw.packets_recv, io.packets_recv
    rt_bw.outgoing_packets, rt_bw.packet_sent = io.packets_sent - rt_bw.packet_sent, io.packets_sent