import { LucideIcon, PowerOff, Zap, ZapOff } from "lucide-react";
import { z } from "zod";

export interface NodesStatusType {
    label: string;
    icon: LucideIcon | null;
}

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
} as Record<string, NodesStatusType>;

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
    usage_coefficient: z.number().default(1),
    add_as_new_host: z.boolean().optional(),
});

export type NodeType = z.infer<typeof NodeSchema>;
