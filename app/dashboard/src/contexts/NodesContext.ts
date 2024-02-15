import { useQuery } from 'react-query';
import { fetch } from 'service/http';
import { create } from 'zustand';
import { z } from 'zod';
import { FilterUsageType, NodesFilterType } from 'types/Filter';
import { getNodesPerPageLimitSize } from 'utils/userPreferenceStorage';
import { useDashboard } from './DashboardContext';

export const NodeSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  port: z
    .number()
    .min(1)
    .or(z.string().transform((v) => parseFloat(v))),
  xray_version: z.string().nullable().optional(),
  id: z.number().nullable().optional(),
  status: z
    .enum(['healthy', 'unhealthy', 'disabled']),
  message: z.string().nullable().optional(),
  usage_coefficient: z.number().default(1),
  add_as_new_host: z.boolean(),
});

export type NodeType = z.infer<typeof NodeSchema>;
export type NodeCreate = Pick<NodeType, 'name' | 'status' | 'address' | 'port' | 'usage_coefficient' | 'id' | 'add_as_new_host'>

export const getNodeDefaultValues = (): NodeType => ({
  name: '',
  address: '',
  status: 'unhealthy',
  port: 62050,
  xray_version: '',
  add_as_new_host: false,
  usage_coefficient: 1,
});

export const FetchNodesQueryKey = 'fetch-nodes-query-key';

export function fetchNodes() {
  return fetch('/nodes');
}

export type NodeStore = {
  nodes: NodeType[];
  certificate: string,
  deletingNode?: NodeType | null;
  editingNode: NodeType | null;
  isAddingNode: boolean;
  isShowingNodesUsage: boolean;
  isEditingNode: boolean;
  isEditingCore: boolean;
  nodesFilters: NodesFilterType;
  refetchNodes: () => void;
  refetchCertificate: () => void;
  fetchNodesUsage: (query: FilterUsageType) => Promise<void>;
  addNode: (node: NodeCreate) => Promise<unknown>;
  deleteNode: (node: NodeCreate) => Promise<unknown>;
  updateNode: (node: NodeCreate) => Promise<unknown>;
  reconnectNode: (node: NodeType) => Promise<unknown>;
  setDeletingNode: (node: NodeType | null) => void;
  onEditingNode: (node: NodeType | undefined) => void;
  onAddingNode: (isAddingNode: boolean) => void;
  onFilterChange: (filters: NodesFilterType) => void;
  onShowingNodesUsage: (isShowingNodesUsage: boolean) => void;
};

export const useNodesQuery = () => {
  return useQuery({
    queryKey: FetchNodesQueryKey,
    queryFn: fetchNodes,
    refetchInterval: useNodes.getState().editingNode ? 3000 : undefined,
    refetchOnWindowFocus: false,
  });
};

export const useNodes = create<NodeStore>((set, get) => ({
  nodes: [],
  certificate: '',
  editingNode: null,
  deletingNode: null,
  isAddingNode: false,
  isEditingNode: false,
  isShowingNodesUsage: false,
  isEditingCore: false,
  nodesFilters: {
    name: '',
    limit: getNodesPerPageLimitSize(),
    sort: '-created_at',
  },
  onFilterChange: (filters) => {
    set({
      nodesFilters: {
        ...get().nodesFilters,
        ...filters,
      },
    });
    get().refetchNodes();
  },
  addNode: async (body) => {
    return fetch('/node', { method: 'POST', body }).then(() => { get().refetchCertificate() });
  },
  refetchNodes: () => {
    useDashboard.setState({ loading: true })
    fetchNodes().then((nodes) => {
      useDashboard.setState({ loading: false })
      set({ nodes });
    })
  },
  refetchCertificate: () => {
    fetch('/nodes/settings').then((res) => {
      set({ certificate: res.certificate });
    })
  },
  fetchNodesUsage: (query: FilterUsageType) => {
    return fetch('/nodes/usage', { query });
  },
  updateNode: (body) => {
    return fetch(`/nodes/${body.id}`, {
      method: 'PUT',
      body,
    });
  },
  setDeletingNode: (node) => {
    set({ deletingNode: node });
  },
  reconnectNode: (body) => {
    return fetch(`/nodes/${body.id}/reconnect`, {
      method: 'POST',
    });
  },
  deleteNode: () => {
    return fetch(`/nodes/${get().deletingNode?.id}`, {
      method: 'DELETE',
    });
  },
  onEditingNode: (editingNode: NodeType | undefined) => {
    set({ editingNode, isEditingNode: (editingNode?.id ? true : false) });
  },
  onAddingNode: (isAddingNode: boolean) => {
    set({ isAddingNode });
  },
  onShowingNodesUsage: (isShowingNodesUsage: boolean) => {
    set({ isShowingNodesUsage });
  },
}));
