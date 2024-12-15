import { z } from "zod";
import { HostSchema } from "@marzneshin/modules/hosts";

export const WireguardSchema = HostSchema.merge(z.object({
    path: z.string().nullable().optional(),
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
}));

export type WireguardSchemaType = z.infer<typeof WireguardSchema>;
