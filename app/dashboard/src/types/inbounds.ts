import { ProtocolType } from './protocol';
import { NodeType } from 'stores';

export type InboundType = {
    id: number;
    tag: string;
    protocol: ProtocolType;
    network: string;
    node: NodeType;
    tls: string;
    port?: number;
};

export type Inbounds = InboundType[];
