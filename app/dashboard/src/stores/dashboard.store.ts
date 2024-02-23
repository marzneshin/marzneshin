import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PageType, Pages } from 'types';
import { chakra } from '@chakra-ui/react';
import { CubeIcon, HomeIcon, ServerIcon, ServerStackIcon, UsersIcon } from '@heroicons/react/24/outline';
import { IconBaseStyle } from 'constants/IconBaseStyle';

const UsersSidebarItemIcon = chakra(UsersIcon, IconBaseStyle);
const ServicesSidebarItemIcon = chakra(ServerStackIcon, IconBaseStyle);
const NodesSidebarItemIcon = chakra(CubeIcon, IconBaseStyle);
const HostSidebarItemIcon = chakra(ServerIcon, IconBaseStyle);
const HomeSidebarItemIcon = chakra(HomeIcon, IconBaseStyle);


export const pages: Pages = {
  home: {
    name: 'home',
    path: '/',
    itemIcon: HomeSidebarItemIcon,
  },
  users: {
    name: 'users',
    path: '/users',
    itemIcon: UsersSidebarItemIcon,
  },
  services: {
    name: 'services',
    path: '/services',
    itemIcon: ServicesSidebarItemIcon,
  },
  nodes: {
    name: 'nodes',
    path: '/nodes',
    itemIcon: NodesSidebarItemIcon,
  },
  hosts: {
    name: 'hosts',
    path: '/hosts',
    itemIcon: HostSidebarItemIcon,
  },
};

type DashboardStateType = {
  version: string | null;
  loading: boolean;
  activePage: PageType;
  isCollapsed: boolean;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  activatePage: (pageId: PageType) => void;
};

export const useDashboard = create(
  subscribeWithSelector<DashboardStateType>((set,) => ({
    version: null,
    loading: true,
    activePage: pages.home,
    isCollapsed: false,
    expandSidebar: () => {
      set({ isCollapsed: false })
    },
    collapseSidebar: () => {
      set({ isCollapsed: true })
    },
    activatePage: (page) => {
      set({ activePage: page });
    },
  }))
);
