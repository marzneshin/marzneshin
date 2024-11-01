import { WireguardSchemaType } from "..";

export const wireguardProfileDefaultValue = (): WireguardSchemaType => {
    return {
        port: 8080,
        path: '',
        address: '',
        remark: '',
        dns_servers: '',
        mtu: undefined,
    }
};
