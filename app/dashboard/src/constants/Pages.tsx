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
    name: 'pageHeaderTitle.Home',
    path: '/',
    itemIcon: HomeSidebarItemIcon,
  },
  {
    name: 'pageHeaderTitle.Users',
    path: '/users',
    itemIcon: UsersSidebarItemIcon,
  },
  {
    name: 'pageHeaderTitle.Services',
    path: '/services',
    itemIcon: ServicesSidebarItemIcon,
  },
  {
    name: 'pageHeaderTitle.Nodes',
    path: '/nodes',
    itemIcon: NodesSidebarItemIcon,
  },
  {
    name: 'pageHeaderTitle.Host',
    path: '/host',
    itemIcon: HostSidebarItemIcon,
  },
];
