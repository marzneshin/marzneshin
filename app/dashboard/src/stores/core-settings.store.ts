import { fetch } from 'service/http';
import { create } from 'zustand';
import { NodeType } from './nodes.store';

type CoreSettingsStore = {
  isLoading: boolean;
  isPostLoading: boolean;
  fetchCoreSettings: () => void;
  updateConfig: (json: string) => Promise<void>;
  restartCore: () => Promise<void>;
  config: string;
  selectedNode: NodeType | null;
  isEditingCore: boolean;
};

export const useCoreSettings = create<CoreSettingsStore>((set, get) => ({
  isLoading: true,
  isPostLoading: false,
  isEditingCore: false,
  config: '',
  selectedNode: null,
  fetchCoreSettings: () => {
    set({ isLoading: true });
    Promise.all([
      fetch(`/nodes/${get().selectedNode?.id}/xray_config`).then((config) => set({ config })),
    ]).finally(() => set({ isLoading: false }));
  },
  updateConfig: async (body) => {
    set({ isPostLoading: true });
    return fetch(`/nodes/${get().selectedNode?.id}/xray_config`, { method: 'PUT', body }).finally(() => {
      set({ isPostLoading: false });
    });
  },
  restartCore: () => {
    return fetch('/core/restart', { method: 'POST' });
  },
}));
