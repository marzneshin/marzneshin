import type { StatusType } from "@marzneshin/common/types/status";
import { PowerOff, Zap, ZapOff } from "lucide-react";
import { z } from "zod";

export const NodesStatus = {
    healthy: {
        label: "healthy",
        icon: Zap,
    },
    unhealthy: {
        label: "unhealthy",
        icon: ZapOff,
    },
    disabled: {
        label: "disabled",
        icon: PowerOff,
    },
    none: {
        label: "none",
        icon: null,
    },
} as Record<string, StatusType>;

export const NodeSchema = z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    port: z
        .number()
        .min(1)
        .or(z.string().transform((v) => Number.parseFloat(v))),
    id: z.number().nullable().optional(),
    status: z.enum([
        NodesStatus.healthy.label,
        NodesStatus.unhealthy.label,
        "none",
        NodesStatus.disabled.label,
    ]),
    usage_coefficient: z
        .number()
        .default(1.0)
        .or(z.string().transform((v) => Number.parseFloat(v))),
    connection_backend: z.enum(["grpclib", "grpcio"]).default("grpclib"),
});

export type NodeBackendType = {
    name: string;
    backend_type: string;
    version: string;
    running: boolean;
};

export type NodeType = z.infer<typeof NodeSchema> & {
    id: number;
    backends: NodeBackendType[];
};
