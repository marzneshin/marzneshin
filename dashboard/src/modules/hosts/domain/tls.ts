import { z } from "zod";

export const alpnOptions = [
    "none",
    "h2",
    "h3",
    "h3,h2",
    "http/1.1",
    "h2,http/1.1",
    "h3,h2,http/1.1"
]

export const TlsSchema = z.object({
    sni: z.string().nullable().optional(),
    alpn: z
        .enum(["", ...alpnOptions])
        .optional()
        .default("none"),
    allowinsecure: z.boolean().default(false).optional(),
});

export type TlsSchemaType = z.infer<typeof TlsSchema>;
