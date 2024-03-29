import { HostSchemaType } from "..";

export const getDefaultValues = (): HostSchemaType => {
    return {
        host: '',
        sni: '',
        port: null,
        path: '',
        address: '',
        remark: '',
        security: 'inbound_default',
        alpn: '',
        fingerprint: '',
    }
};
