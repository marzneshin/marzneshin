import { fetch } from 'service/http';
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
    version: string | null;
    inbounds: Inbounds;
    loading: boolean;
    subscribeUrl: string | null;
    QRcodeLinks: string[] | null;
    isEditingHosts: boolean;
    isEditingNodes: boolean;
    isShowingNodesUsage: boolean;
    isEditingCore: boolean;
    activePage: number;
    activatePage: (pageId: PageId) => void;
    refetchInbounds: () => void;
    setQRCode: (links: string[] | null) => void;
    setSubLink: (subscribeURL: string | null) => void;
    onEditingHosts: (isEditingHosts: boolean) => void;
    onEditingNodes: (isEditingHosts: boolean) => void;
    onShowingNodesUsage: (isShowingNodesUsage: boolean) => void;
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
    QRcodeLinks: null,
    subscribeUrl: null,
    loading: true,
    isEditingHosts: false,
    isEditingNodes: false,
    isShowingNodesUsage: false,
    inbounds: [],
    isEditingCore: false,
    activePage: 0,
    activatePage: (pageId: number) => {
      set({ activePage: pageId });
    },
    refetchInbounds: () => {
      fetchInbounds();
    },
    setQRCode: (QRcodeLinks) => {
      set({ QRcodeLinks });
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
