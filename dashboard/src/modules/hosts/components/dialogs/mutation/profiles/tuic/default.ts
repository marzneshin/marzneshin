import { TuicSchemaType } from "./schema";

export const tuicProfileDefaultValue: TuicSchemaType = {
    sni: '',
    port: 8080,
    address: '',
    weight: 1,
    remark: '',
    alpn: '',
    allowinsecure: false,
    is_disabled: false,
};
