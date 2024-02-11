

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
