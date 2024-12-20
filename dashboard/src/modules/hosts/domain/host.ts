import { z } from "zod";
import { ProtocolType } from "@marzneshin/modules/inbounds";

export const HostSchema = z.object({
    remark: z.string().min(1, "Remark is required"),
    address: z.string().min(1, "Address is required"),
    is_disabled: z.boolean().default(false),
    weight: z.coerce
        .number().int()
        .nullable()
        .optional(),
    port: z
        .preprocess(
            (val) => (val === "" || val === undefined || val === null ? null : Number(val)),
            z.union([
                z
                    .number()
                    .int()
                    .gte(1, "Port must be more than 1")
                    .lte(65535, "Port cannot be more than 65535"),
                z.null(),
            ])
        ),
});


export type HostSchemaType = z.infer<typeof HostSchema>;
export type HostType = HostSchemaType & { id?: number, inboundId?: number, protocol: ProtocolType };
