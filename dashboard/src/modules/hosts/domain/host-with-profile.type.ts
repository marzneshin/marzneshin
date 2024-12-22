import {
    GeneralSchemaType,
    WireguardSchemaType,
    Hysteria2SchemaType,
    TuicSchemaType,
} from "../dialogs/mutation/profiles";
import { HostSchemaType } from "./host";
import { ProtocolType } from "@marzneshin/modules/inbounds";

export type HostWithProfileSchemaType =
    | HostSchemaType
    | GeneralSchemaType
    | WireguardSchemaType
    | Hysteria2SchemaType
    | TuicSchemaType;

export type HostWithProfileType = HostWithProfileSchemaType & {
    id?: number;
    inboundId?: number;
    protocol: ProtocolType;
    http_headers?: { [key: string]: string };
};
