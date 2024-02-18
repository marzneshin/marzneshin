import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useDashboard } from './dashboard.store';
import { fetch } from 'service/http';
import { Inbounds } from 'types/inbounds';
import { z } from 'zod';

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
  security: z.string(),
  alpn: z.string().optional(),
  fingerprint: z.string().optional(),
});

type HostType = z.infer<typeof hostSchema>;
type Hosts = HostType[];

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
  // Hosts
  host: HostType | null;
  setHost: (hosts: HostType) => void;
  isEditingHost: boolean;
  onEditingHost: (isEditingHost: boolean, host: HostType) => void;
  editHost: (inboundId: number, host: HostType) => void;
  isCreatingHost: boolean;
  onCreatingHost: (isCreatingHost: boolean, host: HostType) => void;
  createHost: (inboundId: number, host: HostType) => Promise<boolean>;
  isDeletingHost: boolean;
  onDeletingHost: (isDeletingHost: boolean, host: HostType) => void;
  deleteHost: (hostId: number) => void;
};

export const useInbounds = create(
  subscribeWithSelector<InboundsStateType>((set,) => ({
    inbounds: [],
    host: null,
    loading: false,
    isDeletingHost: false,
    isCreatingHost: false,
    isEditingHost: false,
    setLoading: (value) => {
      set({ loading: value })
    },
    refetchInbounds: () => {
      fetchInbounds();
    },
    setHost: (host: HostType): void => {
      set({ host })
    },
    onEditingHost: (isEditingHost: boolean, host: HostType) => {
      set({ isEditingHost, host });
    },
    editHost: async (inboundId: number, body: HostType): Promise<boolean> => {
      useDashboard.setState({ loading: true });
      return fetch(`/inbounds/${inboundId}/hosts`, { method: 'DELETE', body })
        .then(() => true)
        .catch(() => false)
        .finally(() => {
          useDashboard.setState({ loading: false });
        });
    },
    onCreatingHost: (isCreatingHost: boolean, host: HostType) => {
      set({ isCreatingHost, host });
    },
    createHost: async (inboundId: number, body: HostType): Promise<boolean> => {
      useDashboard.setState({ loading: true });
      return fetch(`/inbounds/${inboundId}/hosts`, { method: 'POST', body })
        .then(() => true)
        .catch(() => false)
        .finally(() => {
          useDashboard.setState({ loading: false });
        });
    },
    onDeletingHost: (isDeletingHost: boolean, host: HostType) => {
      set({ isDeletingHost, host });
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
