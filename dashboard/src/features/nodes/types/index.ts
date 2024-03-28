import { StatusType } from "@marzneshin/types/status";
import { PowerOff, Zap, ZapOff } from "lucide-react";
import { z } from "zod";


export const NodesStatus = {
    healthy: {
        label: 'healthy',
        icon: Zap,
    },
    unhealthy: {
        label: 'unhealthy',
        icon: ZapOff,
    },
    disabled: {
        label: 'disabled',
        icon: PowerOff,
    },
    none: {
        label: 'none',
        icon: null,
    }
} as Record<string, StatusType>;

export const NodeSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    port: z
        .number()
        .min(1)
        .or(z.string().transform((v) => parseFloat(v))),
    id: z.number().nullable().optional(),
    status: z
        .enum([NodesStatus.healthy.label, NodesStatus.unhealthy.label, 'none', NodesStatus.disabled.label]),
    usage_coefficient: z.number().default(1.0),
    add_as_new_host: z.boolean().optional(),
});

export type NodeType = z.infer<typeof NodeSchema>;
