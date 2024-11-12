import { z } from "zod";
import { HostSchema } from "@marzneshin/modules/hosts";

export const WireguardSchema = HostSchema.extend({
    path: z.string().nullable().optional(),
    is_disabled: z.boolean(),
    allowed_ips: z.string().nullable().optional(),
    mtu: z.coerce
        .number()
        .or(z.string())
        .nullable()
        .optional(),
    dns_servers: z.coerce
        .string()
        .nullable()
        .optional(),
});

export type WireguardSchemaType = z.infer<typeof WireguardSchema>;
