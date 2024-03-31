import { z } from "zod";

export const HostSchema = z.object({
    remark: z.string().min(1, 'Remark is required'),
    address: z.string().min(1, 'Address is required'),
    port: z.coerce.number()
        .gte(1, 'Port must be more than 1')
        .lte(65535, 'Port can not be more than 65535')
        .or(z.string()),
    path: z.string(),
    sni: z.string().optional(),
    host: z.string().optional(),
    security: z.enum(['inbound_default', 'none', 'tls']),
    alpn: z.enum(['none', 'h2', 'http/1.1', 'h2,http/1.1']).optional(),
    allowinsecure: z.boolean().default(false),
    fingerprint: z.enum([
        "none",
        "chrome",
        "firefox",
        "safari",
        "ios",
        "android",
        "edge",
        "360",
        "qq",
        "random",
        "randomized",
    ]).optional(),
});
