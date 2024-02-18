import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type PageId = number;

type DashboardStateType = {
  version: string | null;
  loading: boolean;
  activePage: number;
  isCollapsed: boolean;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  activatePage: (pageId: PageId) => void;
};

export const useDashboard = create(
  subscribeWithSelector<DashboardStateType>((set,) => ({
    version: null,
    loading: true,
    activePage: 0,
    isCollapsed: false,
    expandSidebar: () => {
      set({ isCollapsed: false })
    },
    collapseSidebar: () => {
      set({ isCollapsed: true })
    },
    activatePage: (pageId: number) => {
      set({ activePage: pageId });
    },
  }))
);
