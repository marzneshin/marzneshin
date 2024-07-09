import { z } from 'zod';

export const CreateAdminSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    is_sudo: z.boolean(),
    enabled: z.boolean().optional(),
    all_services_access: z.boolean().optional(),
    modify_users_access: z.boolean().optional(),
    subscription_url_prefix: z.boolean().optional(),
    password: z.string(),
    service_ids: z
        .array(z.number().or(z.string()))
        .transform((v) => v.map(Number))
        .optional()
});

export const EditAdminSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string(),
    is_sudo: z.boolean(),
});

export type CreateAdminType = z.infer<typeof CreateAdminSchema>;
export type EditAdminType = z.infer<typeof EditAdminSchema>;
