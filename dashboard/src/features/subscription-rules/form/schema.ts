import { z } from "zod";


export const schema = z.object({
    rules: z.array(
        z.object({
            pattern: z.string(),
            result: z.enum(["xray", "v2ray", "sing-box", "clash", "clash-meta", "block"]),
        })
    ),
})
