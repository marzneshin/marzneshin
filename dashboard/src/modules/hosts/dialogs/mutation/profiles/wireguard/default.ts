import { WireguardSchemaType } from "..";

export const wireguardProfileDefaultValue: WireguardSchemaType = {
    port: 8080,
    path: '',
    address: '',
    remark: '',
    dns_servers: '',
    is_disabled: false,
    mtu: undefined,
};
