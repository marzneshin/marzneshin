import { HostSchemaType } from "..";

export const getDefaultValues = (): HostSchemaType => {
    return {
        host: '',
        sni: '',
        port: 8080,
        path: '',
        address: '',
        remark: '',
        fragment: null,
        mux: false,
        security: 'inbound_default',
        alpn: "",
        allowinsecure: false,
        fingerprint: "",
    }
};
