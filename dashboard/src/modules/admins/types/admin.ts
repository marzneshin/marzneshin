
export interface AdminType {
    id: number;
    username: string;
    enabled: boolean;
    is_sudo: boolean;
    all_services_access: boolean;
    modify_users_access: boolean;
    service_ids: number[];
    subscription_url_prefix: string;
    users_data_usage: number;
}

