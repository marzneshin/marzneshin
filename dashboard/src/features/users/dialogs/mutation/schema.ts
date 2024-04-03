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
}).refine(data => {
    const { expire, on_hold_expire_duration, on_hold_timeout, data_limit_reset_strategy, data_limit } = data;

    if (expire === null) {
        // When expire is null, on_hold_expire_duration and on_hold_timeout must be null or positive
        if (on_hold_expire_duration === null || on_hold_expire_duration <= 0 || on_hold_timeout === null) {
            return false;
        }
    } else {
        // When expire is not null, on_hold_expire_duration and on_hold_timeout must be undefined
        if (on_hold_expire_duration !== undefined || on_hold_timeout !== undefined) {
            return false;
        }
    }

    // When data_limit is not zero, data_limit_reset_strategy has to be set
    if (data_limit !== 0 && !data_limit_reset_strategy) {
        return false;
    }

    return true;
}, {
    message: 'Invalid data',
    path: [],
});
