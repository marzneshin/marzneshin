import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useDashboard } from './dashboard.store';
import { fetch } from 'service/http';
import { Inbounds, InboundType } from 'types/inbounds';
import { z } from 'zod';
import { HostsFilterType, InboundsFilterType } from 'types';
import { pageSizeManagers } from 'utils/userPreferenceStorage';
import { queryClient } from 'service/react-query';
import { queryIds } from 'constants/query-ids';

export const hostSchema = z.object({
  remark: z.string().min(1, 'Remark is required'),
  address: z.string().min(1, 'Address is required'),
  port: z.coerce.number()
    .gte(1, 'Port must be more than 1')
    .lte(65535, 'Port can not be more than 65535'),
  path: z.string(),
  sni: z.string(),
  host: z.string(),
  security: z.enum(['inbound_default', 'none', 'tls']),
  alpn: z.string().optional(),
  fingerprint: z.string().optional(),
});

export type HostSchema = z.infer<typeof hostSchema>;
export type HostType = HostSchema & { id?: number };
export type Hosts = HostType[];

export const fetchInbounds = async () => {
  useDashboard.setState({ loading: true });
  return fetch('/inbounds')
    .then((inbounds: Inbounds) => inbounds)
    .finally(() => {
      useDashboard.setState({ loading: false });
    });
};

export const fetchInboundHosts = async (id: number | undefined): Promise<Hosts> => {
  if (id !== undefined) {
    useDashboard.setState({ loading: true });
    return fetch(`/inbounds/${id}/hosts`)
      .then((hosts: Hosts) => {
        return hosts
      })
      .finally(() => {
        useDashboard.setState({ loading: false });
      });
  } else { return [] }
};

type InboundsStateType = {
  // Loading
  loading: boolean;
  setLoading: (value: boolean) => void;
  // Inbounds
  selectedInbound: InboundType | undefined;
  selectInbound: (inbound: InboundType) => void;
  refetchInbounds: () => void;
  // Hosts
  refetchHosts: () => void;
  hostsFilters: HostsFilterType;
  inboundsFilters: InboundsFilterType;
  onHostsFilterChange: (filters: Partial<HostsFilterType>) => void;
  onInboundsFilterChange: (filters: Partial<InboundsFilterType>) => void;
  selectedHost: HostType | null;
  selectHost: (host: HostType) => void;
  isEditingHost: boolean;
  onEditingHost: (isEditingHost: boolean, host: HostType | null) => void;
  editHost: (inboundId: number | undefined, host: HostType) => Promise<boolean | void>;
  isCreatingHost: boolean;
  onCreatingHost: (isCreatingHost: boolean) => void;
  createHost: (inboundId: number | undefined, host: HostSchema) => Promise<boolean | void>;
  isDeletingHost: boolean;
  onDeletingHost: (isDeletingHost: boolean, host: HostType) => void;
  deleteHost: (hostId: number) => void;
};

export const useInbounds = create(
  subscribeWithSelector<InboundsStateType>((set, get) => ({
    selectedHost: null,
    selectedInbound: undefined,
    loading: false,
    isDeletingHost: false,
    isCreatingHost: false,
    isEditingHost: false,
    hostsFilters: {
      name: '',
      limit: pageSizeManagers.hosts.getPageSize(),
      sort: '-created_at',
    },
    inboundsFilters: {
      name: '',
      limit: pageSizeManagers.inbounds.getPageSize(),
      sort: '-created_at',
    },
    onHostsFilterChange: (filters) => {
      set({
        hostsFilters: {
          ...get().hostsFilters,
          ...filters,
        },
      });
    },
    onInboundsFilterChange: (filters) => {
      set({
        hostsFilters: {
          ...get().inboundsFilters,
          ...filters,
        },
      });
    },
    setLoading: (value) => {
      set({ loading: value })
    },
    refetchInbounds: () => {
      queryClient.invalidateQueries({ queryKey: [queryIds.inbounds] });
    },
    refetchHosts: async () => {
      queryClient.invalidateQueries({ queryKey: [queryIds.hosts] });
    },
    selectInbound: (host): void => {
      set({ selectedInbound: host })
    },
    selectHost: (host: HostType): void => {
      set({ selectedHost: host })
    },
    onEditingHost: (isEditingHost: boolean, host: HostType | null) => {
      set({ isEditingHost, selectedHost: host });
    },
    editHost: async (hostId: number | undefined, body: HostSchema): Promise<boolean | void> => {
      if (hostId !== undefined) {
        useDashboard.setState({ loading: true });
        return fetch(`/inbounds/hosts/${hostId}`, { method: 'PUT', body })
          .then(() => {
            get().refetchHosts();
            return true;
          })
          .catch(() => false)
          .finally(() => {
            useDashboard.setState({ loading: false });
          });
      }
    },
    onCreatingHost: (isCreatingHost: boolean) => {
      set({ isCreatingHost });
    },
    createHost: async (inboundId: number | undefined, body: HostSchema): Promise<boolean | void> => {
      if (inboundId !== undefined) {
        useDashboard.setState({ loading: true });
        return fetch(`/inbounds/${inboundId}/hosts`, { method: 'POST', body })
          .then(() => {
            get().refetchHosts();
            return true;
          })
          .catch(() => false)
          .finally(() => {
            useDashboard.setState({ loading: false });
          });
      }
    },
    onDeletingHost: (isDeletingHost: boolean, host: HostType | null) => {
      set({ isDeletingHost, selectedHost: host });
    },
    deleteHost: async (hostId: number): Promise<boolean> => {
      useDashboard.setState({ loading: true });
      return fetch(`/inbounds/hosts/${hostId}`, { method: 'DELETE' })
        .then(() => {
          get().refetchHosts();
          return true;
        })
        .catch(() => false)
        .finally(() => {
          useDashboard.setState({ loading: false });
        });
    },
  }))
);
