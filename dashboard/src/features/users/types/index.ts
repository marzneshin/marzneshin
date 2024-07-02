import { z } from 'zod';
import { DATA_LIMIT_METRIC } from '@marzneshin/features/users';

export const UserSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    note: z.string().nullable(),
    data_limit: z
        .union([z.string().transform((str) => Number(str) * DATA_LIMIT_METRIC), z.number()])
        .refine(val => val >= 0, { message: 'The minimum number is 0' })
        .transform((val) => val ?? 0)
        .nullable()
        .optional(),
    data_limit_reset_strategy: z
        .enum(["no_reset", "day", "week", "month", "year"])
        .or(z.number())
        .or(z.string())
        .nullable().optional(),
    expire_strategy: z.enum(["never", "fixed_date", "start_on_first_use"]),
    usage_duration: z.number().nullable().optional(),
    activation_deadline: z
        .string()
        .nullable()
        .optional(),
    expire_date: z
        .string()
        .nullable()
        .optional(),
    service_ids: z
        .array(z.number().or(z.string()))
        .nonempty({ message: 'At least one service is required' })
        .transform((v) => v.map(Number)),
});

export type DataLimitResetStrategy =
    | 'no_reset'
    | 'day'
    | 'week'
    | 'month'
    | 'year';

export type Status =
    | 'active'
    | 'disabled'
    | 'limited'
    | 'expired'
    | 'on_hold'
    | 'error'
    | 'connecting'
    | 'healthy'
    | 'unhealthy'
    | 'connected';

export type ExpireStrategy = "never" | "fixed_date" | "start_on_first_use";

export interface UserType {
    expire_strategy: ExpireStrategy;
    usage_duration?: number| null;
    activation_deadline?: Date | string;
    expire_date?: Date | string;
    data_limit?: number;
    data_limit_reset_strategy: DataLimitResetStrategy;
    lifetime_used_traffic: number;
    used_traffic: number;
    sub_updated_at?: Date | string;
    sub_last_user_agent?: string;
    enabled: boolean;
    activated: boolean;
    is_active: boolean;
    expired: boolean;
    data_limit_reached: boolean;
    username: string;
    created_at: string | Date;
    links: string[];
    subscription_url: string;
    service_ids: number[];
    note: string;
    online_at: string;
}

export type UserMutationType = z.infer<typeof UserSchema>;
