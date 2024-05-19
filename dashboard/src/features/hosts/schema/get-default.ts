import { HostSchemaType } from "..";

export const getDefaultValues = (): HostSchemaType => {
    return {
        host: '',
        sni: '',
        port: 8080,
        path: '',
        address: '',
        remark: '',
        security: 'inbound_default',
        alpn: "",
        allowinsecure: false,
        fingerprint: "",
    }
};
