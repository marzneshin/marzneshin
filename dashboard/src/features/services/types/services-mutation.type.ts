import { z } from "zod";

export const ServiceCreateSchema = z.object({
    inbounds: z.array(z.number()),
    name: z.string().trim().min(1),
    id: z.number().optional()
})

export type ServiceMutationType = z.infer<typeof ServiceCreateSchema>
