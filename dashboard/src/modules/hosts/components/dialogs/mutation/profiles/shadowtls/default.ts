import { ShadowTlsSchemaType } from "./schema";

export const shadowTlsProfileDefaultValue: ShadowTlsSchemaType = {
    sni: '',
    port: 8080,
    address: '',
    remark: '',
    alpn: "",
    allowinsecure: false,
    is_disabled: false,
};
