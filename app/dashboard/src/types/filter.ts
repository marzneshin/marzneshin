

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
    status?: 'healthy' | 'disabled' | 'healthy';
}

export type HostsFilterType = FilterType & {
    name?: string;
    address?: string;
    port?: number;
    security?: number;
}

export type InboundsFilterType = FilterType & {
    tag?: string;
}
