import { z } from 'zod';

export const AdminEditSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    is_sudo: z.boolean(),
    enabled: z.boolean().optional(),
    all_services_access: z.boolean().optional(),
    modify_users_access: z.boolean().optional(),
    subscription_url_prefix: z.string().optional(),
    password: z.string().nullable(),
    service_ids: z
        .array(z.number().or(z.string()))
        .transform((v) => v.map(Number))
        .optional()
});


export const AdminCreateSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    is_sudo: z.boolean(),
    enabled: z.boolean().optional(),
    all_services_access: z.boolean().optional(),
    modify_users_access: z.boolean().optional(),
    subscription_url_prefix: z.string().optional(),
    password: z.string().min(1, { message: "Password is required" }),
    service_ids: z
        .array(z.number().or(z.string()))
        .transform((v) => v.map(Number))
        .optional()
});

export type AdminMutationType = z.infer<typeof AdminEditSchema>;
