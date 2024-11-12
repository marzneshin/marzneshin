import { z } from "zod";
import { HostSchema, TlsSchema } from "@marzneshin/modules/hosts";

export const Hysteria2Schema =
    HostSchema.merge(
        TlsSchema.extend({
            path: z.string().nullable().optional(),
            is_disabled: z.boolean(),
        }))
    ;

export type Hysteria2SchemaType = z.infer<typeof Hysteria2Schema>;
