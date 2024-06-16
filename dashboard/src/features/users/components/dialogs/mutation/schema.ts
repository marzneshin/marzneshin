import { z } from 'zod';
import { DATA_LIMIT_METRIC } from '@marzneshin/features/users';

export const UserSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    note: z.string().nullable(),
    data_limit: z
        .union([z.string().transform((str) => Number(str) * DATA_LIMIT_METRIC), z.number()])
        .refine(val => val >= 0, { message: 'The minimum number is 0' })
        .nullable()
        .optional()
        .transform((val) => val ?? 0),
    expire: z.string().or(z.number()).nullable().optional(),
    data_limit_reset_strategy: z.string().nullable().optional(),
    status: z.string(),
    on_hold_expire_duration: z.number().nullable().optional(),
    on_hold_timeout: z.string().nullable().optional(),
    service_ids: z.array(z.number().or(z.string())).nonempty({ message: 'At least one service is required' })
        .transform((v) => v.map(Number)),
});
