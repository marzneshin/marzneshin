import { StatisticsQueryKey } from 'components/Statistics';
import { fetch } from 'service/http';
import { User, UserCreate } from 'types/User';
import { Service, CreateService } from 'types/Service';
import { queryClient } from 'utils/react-query';
import { getServicesPerPageLimitSize, getUsersPerPageLimitSize } from 'utils/userPreferenceStorage';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type UsersFilterType = {
    username?: string;
    limit?: number;
    offset?: number;
    sort: string;
    status?: 'active' | 'disabled' | 'limited' | 'expired' | 'on_hold';
};

export type ServicesFilterType = {
    name?: string;
    users?: number;
    inbounds?: number;
    limit?: number;
    offset?: number;
    sort: string;
};

export type ProtocolType = 'vmess' | 'vless' | 'trojan' | 'shadowsocks';

export type FilterUsageType = {
    start?: string;
    end?: string;
};

export type InboundType = {
    tag: string;
    protocol: ProtocolType;
    network: string;
    tls: string;
    port?: number;
};

export type Inbounds = Map<ProtocolType, InboundType[]>;
type PageId = number;

type DashboardStateType = {
    isCreatingNewUser: boolean;
    editingUser: User | null | undefined;
    editingService: Service | null | undefined;
    deletingUser: User | null;
    version: string | null;
    users: {
        users: User[];
        total: number;
    };
    inbounds: Inbounds;
    services: Service[];
    loading: boolean;
    usersFilters: UsersFilterType;
    servicesFilters: ServicesFilterType;
    subscribeUrl: string | null;
    QRcodeLinks: string[] | null;
    isEditingHosts: boolean;
    isEditingNodes: boolean;
    isShowingNodesUsage: boolean;
    isResetingAllUsage: boolean;
    resetUsageUser: User | null;
    revokeSubscriptionUser: User | null;
    isEditingCore: boolean;
    activePage: number;
    activatePage: (pageId: PageId) => void;
    onCreateUser: (isOpen: boolean) => void;
    onCreateService: (isOpen: boolean) => void;
    onEditingUser: (user: User | null) => void;
    onEditingService: (service: Service | null) => void;
    onDeletingUser: (user: User | null) => void;
    onResetAllUsage: (isResetingAllUsage: boolean) => void;
    refetchUsers: () => void;
    refetchServices: () => void;
    resetAllUsage: () => Promise<void>;
    onFilterChange: (filters: Partial<UsersFilterType>) => void;
    deleteUser: (user: User) => Promise<void>;
    createUser: (user: UserCreate) => Promise<void>;
    editUser: (user: UserCreate) => Promise<void>;
    fetchUserUsage: (user: User, query: FilterUsageType) => Promise<void>;
    setQRCode: (links: string[] | null) => void;
    setSubLink: (subscribeURL: string | null) => void;
    onEditingHosts: (isEditingHosts: boolean) => void;
    onEditingNodes: (isEditingHosts: boolean) => void;
    onShowingNodesUsage: (isShowingNodesUsage: boolean) => void;
    resetDataUsage: (user: User) => Promise<void>;
    revokeSubscription: (user: User) => Promise<void>;
};

export const fetchUsers = async (query: UsersFilterType): Promise<User[]> => {
    for (const key in query) {
        if (!query[key as keyof UsersFilterType]) delete query[key as keyof UsersFilterType];
    }
    useDashboard.setState({ loading: true });
    return fetch('/users', { query })
        .then((users) => {
            for (let i = 0; i < users.users.length; i++) {
                users.users[i].service = users.users[i].service_ids;
            }
            useDashboard.setState({ users });
            return users;
        })
        .finally(() => {
            useDashboard.setState({ loading: false });
        });
};

export const fetchServices = async (query: UsersFilterType): Promise<Service[]> => {
    for (const key in query) {
        if (!query[key as keyof UsersFilterType]) delete query[key as keyof UsersFilterType];
    }
    useDashboard.setState({ loading: true });
    return fetch('/services')
        .then((services) => {
            useDashboard.setState({ services });
            return services;
        })
        .finally(() => {
            useDashboard.setState({ loading: false });
        });
};

export const fetchInbounds = async () => {
    return fetch('/inbounds')
        .then((inbounds: Inbounds) => {
            useDashboard.setState({
                inbounds: new Map(Object.entries(inbounds)) as Inbounds,
            });
        })
        .finally(() => {
            useDashboard.setState({ loading: false });
        });
};

export const useDashboard = create(
    subscribeWithSelector<DashboardStateType>((set, get) => ({
        version: null,
        editingUser: null,
        editingService: null,
        deletingUser: null,
        isCreatingNewUser: false,
        isCreatingNewService: false,
        QRcodeLinks: null,
        subscribeUrl: null,
        users: {
            users: [],
            total: 0,
        },
        loading: true,
        services: [],
        isResetingAllUsage: false,
        isEditingHosts: false,
        isEditingNodes: false,
        isShowingNodesUsage: false,
        resetUsageUser: null,
        revokeSubscriptionUser: null,
        servicesFilters: {
            name: '',
            limit: getServicesPerPageLimitSize(),
            sort: '-created_at',
        },
        usersFilters: {
            username: '',
            limit: getUsersPerPageLimitSize(),
            sort: '-created_at',
        },
        inbounds: new Map(),
        isEditingCore: false,
        activePage: 0,
        activatePage: (pageId: number) => {
            set({ activePage: pageId });
        },
        refetchServices: () => {
            fetchServices(get().servicesFilters);
        },
        refetchUsers: () => {
            fetchUsers(get().usersFilters);
        },
        resetAllUsage: async () => {
            return fetch('/users/reset', { method: 'POST' }).then(() => {
                get().onResetAllUsage(false);
                get().refetchUsers();
            });
        },
        onResetAllUsage: (isResetingAllUsage) => set({ isResetingAllUsage }),
        onCreateUser: (isCreatingNewUser) => set({ isCreatingNewUser }),
        onCreateService: (isCreatingNewService) => set({ isCreatingNewService }),
        onEditingService: (editingService) => {
            set({ editingService });
        },
        onEditingUser: (editingUser) => {
            set({ editingUser });
        },
        onDeletingUser: (deletingUser) => {
            set({ deletingUser });
        },
        onFilterChange: (filters) => {
            set({
                usersFilters: {
                    ...get().usersFilters,
                    ...filters,
                },
            });
            get().refetchUsers();
        },
        setQRCode: (QRcodeLinks) => {
            set({ QRcodeLinks });
        },
        deleteUser: async (user: User) => {
            set({ editingUser: null });
            return fetch(`/user/${user.username}`, { method: 'DELETE' }).then(() => {
                set({ deletingUser: null });
                get().refetchUsers();
                queryClient.invalidateQueries(StatisticsQueryKey);
            });
        },
        createUser: async (body: UserCreate) => {
            return fetch('/user', { method: 'POST', body }).then(() => {
                set({ editingUser: null });
                get().refetchUsers();
                get().refetchServices();
                queryClient.invalidateQueries(StatisticsQueryKey);
            });
        },
        editUser: async (body: UserCreate) => {
            return fetch(`/user/${body.username}`, { method: 'PUT', body }).then(
                () => {
                    get().onEditingUser(null);
                    get().refetchUsers();
                }
            );
        },
        deleteService: async (service: Service) => {
            set({ editingUser: null });
            return fetch(`/service/${service.id}`, { method: 'DELETE' }).then(() => {
                set({ deletingUser: null });
                get().refetchUsers();
                queryClient.invalidateQueries(StatisticsQueryKey);
            });
        },
        createService: async (bodyWithId: Service) => {
            const body: CreateService = bodyWithId;
            return fetch('/service', { method: 'POST', body }).then(() => {
                set({ editingService: null });
                get().refetchServices();
                get().refetchServices();
                queryClient.invalidateQueries(StatisticsQueryKey);
            });
        },
        editService: async (bodyWithId: Service) => {
            const body: CreateService = bodyWithId;
            return fetch(`/service/${bodyWithId.id}`, { method: 'PUT', body }).then(
                () => {
                    get().onEditingUser(null);
                    get().refetchUsers();
                }
            );
        },
        fetchUserUsage: (body: User, query: FilterUsageType) => {
            for (const key in query) {
                if (!query[key as keyof FilterUsageType])
                    delete query[key as keyof FilterUsageType];
            }
            return fetch(`/user/${body.username}/usage`, { method: 'GET', query });
        },
        onEditingHosts: (isEditingHosts: boolean) => {
            set({ isEditingHosts });
        },
        onEditingNodes: (isEditingNodes: boolean) => {
            set({ isEditingNodes });
        },
        onShowingNodesUsage: (isShowingNodesUsage: boolean) => {
            set({ isShowingNodesUsage });
        },
        setSubLink: (subscribeUrl) => {
            set({ subscribeUrl });
        },
        resetDataUsage: async (user) => {
            return fetch(`/user/${user.username}/reset`, { method: 'POST' }).then(
                () => {
                    set({ resetUsageUser: null });
                    get().refetchUsers();
                }
            );
        },
        revokeSubscription: async (user) => {
            return fetch(`/user/${user.username}/revoke_sub`, {
                method: 'POST',
            }).then((user) => {
                set({ revokeSubscriptionUser: null, editingUser: user });
                get().refetchUsers();
            });
        },
    }))
);
