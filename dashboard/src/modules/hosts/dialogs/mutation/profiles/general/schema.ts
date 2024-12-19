import {z} from "zod";
import {HostSchema, TlsSchema} from "@marzneshin/modules/hosts";
import i18n from "i18next";

const numberInterval = (v: string | null | undefined) => {
    return v ? /^[\d-]{1,32}$/.test(v) : false;
};

const packetsInterval = (v: string | null | undefined) => {
    return v ? /^(:?tlshello|[\d-]{1,32})$/.test(v) : false;
};

export const alpnOptions = [
    "none",
    "h2",
    "h3",
    "h3,h2",
    "http/1.1",
    "h2,http/1.1",
    "h3,h2,http/1.1"
]

export const XMuxSettingsSchema = z.object({
    max_concurrency: z.string().nullable().optional(),
    max_connections: z.string().nullable().optional(),
    max_reuse_times: z.string().nullable().optional(),
    max_lifetime: z.string().nullable().optional(),
});

export const SplitHttpSettingsSchema = z.object({
    mode: z.string().nullable().optional(),
    no_grpc_header: z.boolean().nullable().optional(),
    padding_bytes: z.string().nullable().optional(),
    xmux: XMuxSettingsSchema.nullable().optional(),
    // Add new fields here, for example:
    max_retries: z.number().nullable().optional(),
    timeout: z.string().nullable().optional(),
});

export const GeneralSchema = HostSchema.merge(TlsSchema).extend({
    path: z.string().nullable().optional(),
    host: z.string().nullable().optional(),
    mux: z.boolean().nullable().optional(),
    fragment: z
        .object({
            interval: z
                .string()
                .refine(
                    (v) => numberInterval(v),
                    i18n.t("page.hosts.fragment.interval-error"),
                ),
            length: z
                .string()
                .refine(
                    (v) => numberInterval(v),
                    i18n.t("page.hosts.fragment.length-error"),
                ),
            packets: z
                .string()
                .refine(
                    (v) => packetsInterval(v),
                    i18n.t("page.hosts.fragment.packets-error"),
                ),
        })
        .nullable()
        .optional(),
    splithttp_settings: SplitHttpSettingsSchema.nullable().optional().default(null),
    security: z
        .enum(["inbound_default", "none", "tls"])
        .default("inbound_default"),
    fingerprint: z
        .enum([
            "",
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
        ])
        .optional()
        .default("none"),
});


export type GeneralSchemaType = z.infer<typeof GeneralSchema>;
