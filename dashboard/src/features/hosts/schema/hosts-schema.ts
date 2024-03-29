import { z } from "zod";

export const HostSchema = z.object({
    remark: z.string().min(1, 'Remark is required'),
    address: z.string().min(1, 'Address is required'),
    port: z.coerce.number()
        .gte(1, 'Port must be more than 1')
        .lte(65535, 'Port can not be more than 65535')
        .or(z.string().nullable()),
    path: z.string(),
    sni: z.string(),
    host: z.string(),
    security: z.enum(['inbound_default', 'none', 'tls']),
    alpn: z.string().optional(),
    fingerprint: z.string().optional(),
});
