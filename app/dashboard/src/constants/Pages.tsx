import { PageType } from 'types/Page';
import { chakra } from '@chakra-ui/react';
import { CubeIcon, HomeIcon, ServerIcon, ServerStackIcon, UsersIcon } from '@heroicons/react/24/outline';
import { IconBaseStyle } from 'constants/IconBaseStyle';

const UsersSidebarItemIcon = chakra(UsersIcon, IconBaseStyle);
const ServicesSidebarItemIcon = chakra(ServerStackIcon, IconBaseStyle);
const NodesSidebarItemIcon = chakra(CubeIcon, IconBaseStyle);
const HostSidebarItemIcon = chakra(ServerIcon, IconBaseStyle);
const HomeSidebarItemIcon = chakra(HomeIcon, IconBaseStyle);

export const pages: PageType[] = [
  {
    name: 'home',
    path: '/',
    itemIcon: HomeSidebarItemIcon,
  },
  {
    name: 'users',
    path: '/users',
    itemIcon: UsersSidebarItemIcon,
  },
  {
    name: 'services',
    path: '/services',
    itemIcon: ServicesSidebarItemIcon,
  },
  {
    name: 'nodes',
    path: '/nodes',
    itemIcon: NodesSidebarItemIcon,
  },
  {
    name: 'hosts',
    path: '/hosts',
    itemIcon: HostSidebarItemIcon,
  },
];
