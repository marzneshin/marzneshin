import { z } from "zod";
import { HostSchema, TlsSchema } from "@marzneshin/modules/hosts";

export const ShadowTlsSchema =
    HostSchema.merge(
        TlsSchema.extend({
            is_disabled: z.boolean(),
        }))
    ;

export type ShadowTlsSchemaType = z.infer<typeof ShadowTlsSchema>;
