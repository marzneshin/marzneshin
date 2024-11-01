import { z } from "zod";
import i18n from "i18next";

const numberInterval = (v: string | null | undefined) => {
    return v ? /^[\d-]{1,32}$/.test(v) : false;
};

const packetsInterval = (v: string | null | undefined) => {
    return v ? /^(:?tlshello|[\d-]{1,32})$/.test(v) : false;
};

export const HostSchema = z.object({
    remark: z.string().min(1, "Remark is required"),
    address: z.string().min(1, "Address is required"),
    weight: z.coerce
        .number().int()
        .nullable()
        .optional(),
    port: z.coerce
        .number()
        .gte(1, "Port must be more than 1")
        .lte(65535, "Port can not be more than 65535")
        .or(z.string())
        .nullable()
        .optional(),
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
    is_disabled: z.boolean(),
});
