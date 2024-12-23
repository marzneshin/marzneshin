import { z } from "zod";

export const XMuxSettingsSchema = z.object({
    max_concurrency: z.string().nullable().optional(),
    max_connections: z.string().nullable().optional(),
    max_reuse_times: z.string().nullable().optional(),
    max_lifetime: z.string().nullable().optional(),
    max_request_times: z.string().nullable().optional(),
    keep_alive_period: z.number().nullable().optional(),
});
