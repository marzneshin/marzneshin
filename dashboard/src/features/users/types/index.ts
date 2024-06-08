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

export interface UserType {
    on_hold_timeout: Date | string | undefined;
    on_hold_expire_duration: number;
    expire: Date | string | null;
    data_limit: number | null | undefined;
    data_limit_reset_strategy: DataLimitResetStrategy;
    lifetime_used_traffic: number;
    enabled: boolean;
    username: string;
    used_traffic: number;
    status: Status;
    links: string[];
    subscription_url: string;
    service_ids: number[];
    note: string;
    online_at: string;
}

export type UserMutationType = Pick<
    UserType,
    | 'service_ids'
    | 'expire'
    | 'data_limit'
    | 'data_limit_reset_strategy'
    | 'on_hold_timeout'
    | 'on_hold_expire_duration'
    | 'username'
    | 'status'
    | 'note'
>;
