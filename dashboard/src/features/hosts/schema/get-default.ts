import { HostSchemaType } from "..";

export const getDefaultValues = (): HostSchemaType => {
    return {
        host: '',
        sni: '',
        port: 8080,
        path: '',
        address: '',
        remark: '',
        security: 'none',
        alpn: "",
        allowinsecure: false,
        fingerprint: "",
    }
};
