import {GeneralSchemaType} from "./schema";

export const generalProfileDefaultValue: GeneralSchemaType = {
    host: null,
    sni: null,
    port: 8080,
    path: null,
    address: '',
    remark: '',
    fragment: null,
    splithttp_settings: null,
    mux: false,
    security: 'inbound_default',
    alpn: "none",
    allowinsecure: false,
    fingerprint: "none",
    is_disabled: false,
};

