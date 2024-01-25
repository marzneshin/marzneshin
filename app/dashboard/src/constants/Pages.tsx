import { PageType } from 'types/Page';
import { chakra } from '@chakra-ui/react';
import { CubeIcon, HomeIcon, ServerIcon, ServerStackIcon, UsersIcon } from '@heroicons/react/24/outline';
import { IconBaseStyle } from 'constants/IconBaseStyle';
import { UsersPage } from 'pages/Users';
import { NodesPage } from 'pages/Nodes';
import { ServicesPage } from 'pages/Services';
import { HostPage } from 'pages/Host';
import { Dashboard } from 'pages/Dashboard';

const UsersSidebarItemIcon = chakra(UsersIcon, IconBaseStyle);
const ServicesSidebarItemIcon = chakra(ServerStackIcon, IconBaseStyle);
const NodesSidebarItemIcon = chakra(CubeIcon, IconBaseStyle);
const HostSidebarItemIcon = chakra(ServerIcon, IconBaseStyle);
const HomeSidebarItemIcon = chakra(HomeIcon, IconBaseStyle);

export const pages: PageType[] = [
  {
    name: 'pageHeaderTitle.Home',
    path: '/',
    itemIcon: HomeSidebarItemIcon,
    element: <Dashboard />,
  },
  {
    name: 'pageHeaderTitle.Users',
    path: '/users',
    itemIcon: UsersSidebarItemIcon,
    element: <UsersPage />,
  },
  {
    name: 'pageHeaderTitle.Services',
    path: '/services',
    itemIcon: ServicesSidebarItemIcon,
    element: <ServicesPage />,
  },
  {
    name: 'pageHeaderTitle.Nodes',
    path: '/nodes',
    itemIcon: NodesSidebarItemIcon,
    element: <NodesPage />,
  },
  {
    name: 'pageHeaderTitle.Host',
    path: '/host',
    itemIcon: HostSidebarItemIcon,
    element: <HostPage />,
  },
];

export type PageRoute = Pick<PageType,
  | 'path'
  | 'element'>
