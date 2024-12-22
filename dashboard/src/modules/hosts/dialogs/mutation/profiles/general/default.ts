import { GeneralSchemaType } from "./schema";

export const generalProfileDefaultValue: GeneralSchemaType = {
    host: null,
    sni: null,
    port: 8080,
    path: null,
    address: "",
    remark: "",
    fragment: null,
    splithttp_settings: null,
    early_data: null,
    http_headers: null,
    mux_settings: {
        protocol: "mux_cool",
        mux_cool_settings: {
            xudp_proxy_443: "reject"
        },
    },
    security: "inbound_default",
    alpn: "none",
    allowinsecure: false,
    fingerprint: "none",
    is_disabled: false,
};
