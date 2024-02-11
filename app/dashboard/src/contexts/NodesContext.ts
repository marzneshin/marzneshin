import { useQuery } from 'react-query';
import { fetch } from 'service/http';
import { z } from 'zod';
import { create } from 'zustand';
import { FilterUsageType } from 'types/Filter';

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
    .enum(['healthy', 'unhealthy', 'disabled'])
    .nullable()
    .optional(),
  message: z.string().nullable().optional(),
  add_as_new_host: z.boolean().optional(),
});

export type NodeType = z.infer<typeof NodeSchema>;

export const getNodeDefaultValues = (): NodeType => ({
  name: '',
  address: '',
  port: 62050,
  xray_version: '',
});

export const FetchNodesQueryKey = 'fetch-nodes-query-key';

export type NodeStore = {
  nodes: NodeType[];
  deletingNode?: NodeType | null;
  isEditingNodes: boolean;
  isShowingNodesUsage: boolean;
  isEditingCore: boolean;
  addNode: (node: NodeType) => Promise<unknown>;
  fetchNodes: () => Promise<NodeType[]>;
  fetchNodesUsage: (query: FilterUsageType) => Promise<void>;
  updateNode: (node: NodeType) => Promise<unknown>;
  reconnectNode: (node: NodeType) => Promise<unknown>;
  deleteNode: () => Promise<unknown>;
  setDeletingNode: (node: NodeType | null) => void;
  onEditingNodes: (isEditingHosts: boolean) => void;
  onShowingNodesUsage: (isShowingNodesUsage: boolean) => void;
};

export const useNodesQuery = () => {
  return useQuery({
    queryKey: FetchNodesQueryKey,
    queryFn: useNodes.getState().fetchNodes,
    refetchInterval: useNodes.getState().isEditingNodes ? 3000 : undefined,
    refetchOnWindowFocus: false,
  });
};

export const useNodes = create<NodeStore>((set, get) => ({
  nodes: [],
  isEditingNodes: false,
  isShowingNodesUsage: false,
  isEditingCore: false,
  addNode(body) {
    return fetch('/node', { method: 'POST', body });
  },
  fetchNodes() {
    return fetch('/nodes');
  },
  fetchNodesUsage(query: FilterUsageType) {
    return fetch('/nodes/usage', { query });
  },
  updateNode(body) {
    return fetch(`/node/${body.id}`, {
      method: 'PUT',
      body,
    });
  },
  setDeletingNode(node) {
    set({ deletingNode: node });
  },
  reconnectNode(body) {
    return fetch(`/node/${body.id}/reconnect`, {
      method: 'POST',
    });
  },
  deleteNode: () => {
    return fetch(`/node/${get().deletingNode?.id}`, {
      method: 'DELETE',
    });
  },
  onEditingNodes: (isEditingNodes: boolean) => {
    set({ isEditingNodes });
  },
  onShowingNodesUsage: (isShowingNodesUsage: boolean) => {
    set({ isShowingNodesUsage });
  },
}));
