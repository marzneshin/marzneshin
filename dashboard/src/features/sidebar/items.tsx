import { SidebarObject } from '@marzneshin/common/components';
import { Box, Home, ShieldCheck, Server, ServerCog, Settings, UsersIcon } from 'lucide-react';

export const sidebarItems: SidebarObject = {
    Dashboard: [
        {
            title: 'Home',
            to: '/',
            icon: <Home />,
            isParent: false,
        },
    ],
    Management: [
        {
            title: 'Users',
            to: '/users',
            icon: <UsersIcon />,
            isParent: false,
        },
        {
            title: 'Services',
            to: '/services',
            icon: <Server />,
            isParent: false,
        },
        {
            title: 'Nodes',
            to: '/nodes',
            icon: <Box />,
            isParent: false,
        },
        {
            title: 'Hosts',
            to: '/hosts',
            icon: <ServerCog />,
            isParent: false,
        },
    ],
    System: [
        {
            title: 'Admins',
            to: '/admins',
            icon: <ShieldCheck />,
            isParent: false,
        },
        {
            title: 'Settings',
            to: '/settings',
            icon: <Settings />,
            isParent: false,
        },
    ]
};

export const sidebarItemsNonSudoAdmin: SidebarObject = {
    Dashboard: [
        {
            title: 'Home',
            to: '/',
            icon: <Home />,
            isParent: false,
        },
    ],
    Management: [
        {
            title: 'Users',
            to: '/users',
            icon: <UsersIcon />,
            isParent: false,
        },
    ],
};
