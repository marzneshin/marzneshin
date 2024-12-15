import { NodeType } from "@marzneshin/modules/nodes";

export type ProtocolType =
    "wireguard"
    | "vless"
    | "vmess"
    | "trojan"
    | "shadowtls"
    | "shadowsocks"
    | "shadowsocks2022"
    | "hysteria2"
    | "tuic"

export interface InboundType {
    id: number;
    tag: string;
    protocol: ProtocolType;
    network: string;
    node: NodeType;
    tls: string;
    port?: number;
}

export type Inbounds = InboundType[];
