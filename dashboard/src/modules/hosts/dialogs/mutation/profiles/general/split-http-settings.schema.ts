import { z } from "zod";
import { XMuxSettingsSchema } from "./x-mux-settings.schema";

export const splitHttpSettingsModes = ["auto", "packet-up", "stream-up", "stream-one"]

export const SplitHttpSettingsSchema = z.object({
    mode: z.enum(["auto", "packet-up", "stream-up", "stream-one"]).nullable().optional(),
    no_grpc_header: z.boolean().nullable().optional(),
    padding_bytes: z.string().nullable().optional(),
    xmux: XMuxSettingsSchema.nullable().optional(),
    max_retries: z.number().nullable().optional(),
    timeout: z.string().nullable().optional(),
});
