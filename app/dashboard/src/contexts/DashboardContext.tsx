import { fetch } from 'service/http';
import { Service, ServiceCreate } from 'types/Service';
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
    id: number;
    tag: string;
    protocol: ProtocolType;
    network: string;
    tls: string;
    port?: number;
};

export type Inbounds = InboundType[];
type PageId = number;

type DashboardStateType = {
    isCreatingNewService: boolean;
    editingService: Service | null | undefined;
    deletingService: Service | null;
    version: string | null;
    inbounds: Inbounds;
    services: Service[];
    loading: boolean;
    servicesFilters: ServicesFilterType;
    subscribeUrl: string | null;
    QRcodeLinks: string[] | null;
    isEditingHosts: boolean;
    isEditingNodes: boolean;
    isShowingNodesUsage: boolean;
    isEditingCore: boolean;
    activePage: number;
    activatePage: (pageId: PageId) => void;
    onCreateService: (isOpen: boolean) => void;
    onEditingService: (service: Service | null) => void;
    onDeletingService: (service: Service | null) => void;
    refetchInbounds: () => void;
    refetchServices: () => void;
    deleteService: (service: Service) => Promise<void>;
    createService: (service: ServiceCreate) => Promise<void>;
    editService: (service: ServiceCreate) => Promise<void>;
    setQRCode: (links: string[] | null) => void;
    setSubLink: (subscribeURL: string | null) => void;
    onEditingHosts: (isEditingHosts: boolean) => void;
    onEditingNodes: (isEditingHosts: boolean) => void;
    onShowingNodesUsage: (isShowingNodesUsage: boolean) => void;
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
      useDashboard.setState({ inbounds });
    })
    .finally(() => {
      useDashboard.setState({ loading: false });
    });
};

export const useDashboard = create(
  subscribeWithSelector<DashboardStateType>((set,) => ({
    version: null,
    editingService: null,
    deletingService: null,
    isCreatingNewService: false,
    QRcodeLinks: null,
    subscribeUrl: null,
    loading: true,
    services: [],
    isEditingHosts: false,
    isEditingNodes: false,
    isShowingNodesUsage: false,
    servicesFilters: {
      name: '',
      limit: getServicesPerPageLimitSize(),
      sort: '-created_at',
    },
    inbounds: [],
    isEditingCore: false,
    activePage: 0,
    activatePage: (pageId: number) => {
      set({ activePage: pageId });
    },
    refetchServices: () => {
      fetchServices(get().servicesFilters);
    },
    refetchInbounds: () => {
      fetchInbounds();
    },
    onResetAllUsage: (isResetingAllUsage) => set({ isResetingAllUsage }),
    onCreateService: (isCreatingNewService) => set({ isCreatingNewService }),
    onEditingService: (editingService) => {
      set({ editingService });
    },
    onDeletingService: (deletingService) => {
      set({ deletingService });
    },
    setQRCode: (QRcodeLinks) => {
      set({ QRcodeLinks });
    },
    deleteService: async (service: Service) => {
      set({ editingUser: null });
      return fetch(`/service/${service.id}`, { method: 'DELETE' }).then(() => {
        set({ deletingUser: null });
        get().refetchUsers();
        queryClient.invalidateQueries(StatisticsQueryKey);
      });
    },
    createService: async (body: ServiceCreate) => {
      return fetch('/service', { method: 'POST', body }).then(() => {
        set({ editingService: null });
        get().refetchServices();
        get().refetchServices();
        queryClient.invalidateQueries(StatisticsQueryKey);
      });
    },
    editService: async (body: ServiceCreate) => {
      return fetch(`/service/${body.id}`, { method: 'PUT', body }).then(
        () => {
          get().onEditingUser(null);
          get().refetchUsers();
        }
      );
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
  }))
);
