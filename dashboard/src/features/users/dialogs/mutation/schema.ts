import { z } from 'zod';

export const UserSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    note: z.string().nullable(),
    data_limit: z
        .string()
        .min(0, 'The minimum number is 0')
        .or(z.number())
        .nullable()
        .transform((str) => {
            if (str) return Number((parseFloat(String(str)) * 1073741824).toFixed(5));
            return 0;
        }),
    expire: z.string().nullable(),
    data_limit_reset_strategy: z.string().nullable(),
    status: z.string(),
    on_hold_expire_duration: z.number().nullable(),
    on_hold_timeout: z.string().nullable(),
    services: z.array(z.number().or(z.string())).nonempty({ message: 'At least one service is required' })
        .transform((v) => v.map(Number)),
});
