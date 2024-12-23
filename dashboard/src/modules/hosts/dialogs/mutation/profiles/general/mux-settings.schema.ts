import { z } from "zod";

export const MuxSettingsSchema = z.object({
    protocol: z
        .enum(["mux_cool", "h2mux", "yamux", "smux"])
        .default("mux_cool"),
    sing_box_mux_settings: z
        .object({
            max_connections: z.number().nullable().optional(),
            max_streams: z.number().nullable().optional(),
            min_streams: z.number().nullable().optional(),
            padding: z.boolean().nullable().optional(),
        })
        .nullable()
        .optional(),
    mux_cool_settings: z
        .object({
            concurrency: z.number().nullable().optional(),
            xudp_concurrency: z.number().nullable().optional(),
            xudp_proxy_443: z
                .enum(["reject", "allow", "skip"])
                .default("reject"),
        })
        .nullable()
        .optional(),
});
