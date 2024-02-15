

export type FilterType = {
    limit?: number;
    offset?: number;
    sort: string;
}

export type UsersFilterType = FilterType & {
    username?: string;
    status?: 'active' | 'disabled' | 'limited' | 'expired' | 'on_hold';
};

export type FilterUsageType = {
    start?: string;
    end?: string;
};

export type ServicesFilterType = FilterType & {
    name?: string;
    users?: number;
    inbounds?: number;
};

export type NodesFilterType = FilterType & {
    name?: string;
    address?: string;
    port?: number;
    xray_version?: number;
    message?: string | null;
    add_as_new_host?: boolean;
    status?: 'healthy' | 'disabled' | 'healthy';
}
