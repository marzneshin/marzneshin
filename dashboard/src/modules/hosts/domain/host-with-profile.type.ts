import {
    GeneralSchemaType,
    WireguardSchemaType,
    Hysteria2SchemaType,
    TuicSchemaType
} from "../dialogs/mutation/profiles";
import { HostSchemaType } from "./host";

export type HostWithProfileSchemaType =
    HostSchemaType
    | GeneralSchemaType
    | WireguardSchemaType
    | Hysteria2SchemaType
    | TuicSchemaType;


export type HostWithProfileType = HostWithProfileSchemaType & { id?: number, inboundId?: number, protocol: ProtocolType };
