import { z } from "zod";


export const schema = z.object({
    rules: z.array(
        z.object({
            pattern: z.string(),
            result: z.enum(["xray", "sing-box", "clash", "clash-meta", "block", "links", "base64-links", "template"]),
        })
    ),
    // url_prefix: z.string().default(""),
    shuffle_configs: z.boolean(),
    placeholder_if_disabled: z.boolean(),
    placeholder_remark: z.string(),
    template_on_acceptance: z.boolean().default(false),
    profile_title: z.string().default(""),
    support_link: z.string().default(""),
    update_interval: z.coerce.number().int().default(0),
})

export type Schema = z.infer<typeof schema>
