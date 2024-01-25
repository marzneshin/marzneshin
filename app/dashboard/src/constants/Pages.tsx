import { PageType } from 'types/Page';
import { chakra } from '@chakra-ui/react';
import { CubeIcon, HomeIcon, ServerIcon, ServerStackIcon, UsersIcon } from '@heroicons/react/24/outline';
import { IconBaseStyle } from 'constants/IconBaseStyle';
import { fetchAdminLoader } from 'components/modules/Router';
import { UsersPage } from 'pages/Users';
import { NodesPage } from 'pages/Nodes';
import { Login } from 'pages/Login';
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
    loader: fetchAdminLoader,
    element: <Dashboard />,
    errorElement: <Login />
  },
  {
    name: 'pageHeaderTitle.Users',
    path: '/users',
    itemIcon: UsersSidebarItemIcon,
    loader: fetchAdminLoader,
    element: <UsersPage />,
    errorElement: <Login />
  },
  {
    name: 'pageHeaderTitle.Services',
    path: '/services',
    itemIcon: ServicesSidebarItemIcon,
    element: <ServicesPage />,
    loader: fetchAdminLoader, errorElement: <Login />
  },
  {
    name: 'pageHeaderTitle.Nodes',
    path: '/nodes',
    itemIcon: NodesSidebarItemIcon,
    element: <NodesPage />,
    loader: fetchAdminLoader,
    errorElement: <Login />
  },
  {
    name: 'pageHeaderTitle.Host',
    path: '/host',
    itemIcon: HostSidebarItemIcon,
    element: <HostPage />,
    loader: fetchAdminLoader,
    errorElement: <Login />
  },
];

export type PageRoute = Pick<PageType,
    | 'path'
    | 'loader'
    | 'element'
    | 'errorElement'>
