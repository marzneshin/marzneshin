import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useDashboard } from './dashboard.store';
import { fetch } from 'service/http';
import { Inbounds, InboundType } from 'types/inbounds';
import { z } from 'zod';
import { HostsFilterType } from 'types';
import { pageSizeManagers } from 'utils/userPreferenceStorage';

const isPortThenValue = (value: number) => (value <= 65535 && value !== 0) ? value : null;

export const hostSchema = z.object({
  remark: z.string().min(1, 'Remark is required'),
  address: z.string().min(1, 'Address is required'),
  port: z
    .string()
    .or(z.number())
    .nullable()
    .transform((value) => {
      if (typeof value === 'number') return isPortThenValue(value);
      if (value !== null && !isNaN(parseInt(value))) return isPortThenValue(Number(parseInt(value)));
      return null;
    }),
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
    .then((inbounds: Inbounds) => {
      useInbounds.setState({ inbounds });
    })
    .finally(() => {
      useDashboard.setState({ loading: false });
    });
};

export const fetchInboundHosts = async (id: string): Promise<Hosts> => {
  useDashboard.setState({ loading: true });
  return fetch(`/inbounds/${id}/hosts`)
    .then((hosts: Hosts) => hosts)
    .finally(() => {
      useDashboard.setState({ loading: false });
    });
};

type InboundsStateType = {
  // Loading
  loading: boolean;
  setLoading: (value: boolean) => void;
  // Inbounds
  inbounds: Inbounds;
  refetchInbounds: () => void;
  selectedInbound: InboundType | null;
  selectInbound: (inbound: InboundType) => void;
  // Hosts
  hostsFilters: HostsFilterType;
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
  subscribeWithSelector<InboundsStateType>((set,) => ({
    inbounds: [],
    selectedHost: null,
    selectedInbound: null,
    loading: false,
    isDeletingHost: false,
    isCreatingHost: false,
    isEditingHost: false,
    hostsFilters: {
      name: '',
      limit: pageSizeManagers.hosts.getPageSize(),
      sort: '-created_at',
    },
    setLoading: (value) => {
      set({ loading: value })
    },
    refetchInbounds: () => {
      fetchInbounds();
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
          .then(() => true)
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
        return fetch(`/inbounds/${inboundId}/hosts/${body}`, { method: 'POST', body })
          .then(() => true)
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
        .then(() => true)
        .catch(() => false)
        .finally(() => {
          useDashboard.setState({ loading: false });
        });
    },
  }))
);
