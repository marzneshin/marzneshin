import { GeneralSchemaType } from "./schema";

export const generalProfileDefaultValue: GeneralSchemaType = {
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
    is_disabled: false,
};

