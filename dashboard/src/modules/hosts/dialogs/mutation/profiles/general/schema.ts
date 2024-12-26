import { z } from "zod";
import { HostSchema, TlsSchema } from "@marzneshin/modules/hosts";
import { SplitHttpSettingsSchema } from "./split-http-settings.schema";
import { MuxSettingsSchema } from "./mux-settings.schema";
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
    "h3,h2,http/1.1",
];

export const noiseTypes = ["rand", "str", "base64"] as const;

const FragmentSchema = z.object({
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
});

const NoiseSchema = z.array(
    z.object({
        delay: z
            .string()
            .refine(
                (v) => numberInterval(v),
                i18n.t("page.hosts.noise.delay-error"),
            ),
        type: z.enum(noiseTypes).default("rand"),
        packet: z.string(),
    }),
);

const FingerprintSchema = z.enum([
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
]);

export const GeneralSchema = HostSchema.merge(TlsSchema).extend({
    path: z.string().nullable().optional().nullish().default(null),
    host: z.string().nullable().optional(),
    mux_settings: MuxSettingsSchema.nullable().optional().default(null),
    http_headers: z.any().nullable().optional().default(null),
    fragment: FragmentSchema.nullable().optional().default(null),
    fingerprint: FingerprintSchema.optional().default("none"),
    splithttp_settings: SplitHttpSettingsSchema.nullable()
        .optional()
        .default(null),
    noise: NoiseSchema.nullable().optional(),
    early_data: z.preprocess(
        (val) =>
            val === "" || val === undefined || val === null
                ? null
                : Number(val),
        z.union([
            z
                .number()
                .int()
                .gte(1, "Port must be more than 1")
                .lte(65535, "Port cannot be more than 65535"),
            z.null(),
        ]),
    ),
    security: z
        .enum(["inbound_default", "none", "tls"])
        .default("inbound_default"),
});

export type GeneralSchemaType = z.infer<typeof GeneralSchema>;
