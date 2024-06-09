import { z } from "zod";


export const schema = z.object({
    rules: z.array(
        z.object({
            pattern: z.string(),
            result: z.enum(["xray", "v2ray", "sing-box", "clash", "clash-meta", "block"]),
        })
    ),
    url_prefix: z.string().default(""),
    profile_title: z.string().default(""),
    support_link: z.string().default(""),
    update_interval: z.coerce.number().int().default(0),
})

export type Schema = z.infer<typeof schema>
