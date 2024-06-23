import { Button, SidebarItem } from "@marzneshin/components";
import i18n from "@marzneshin/features/i18n";
import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { Box, Home, Server, ServerCog, UsersIcon } from 'lucide-react';
import { useIsCurrentRoute } from "@marzneshin/hooks";

type BottomMenuItemProps = Omit<SidebarItem, 'isParent' | 'subItem'>

const BottomMenuItem: FC<BottomMenuItemProps & { active: boolean }> = ({ title, icon, to, active }) => {
    return (
        <Button asChild variant={active ? "default" : "secondary"} className="gap-1 flex flex-col justify-center text-xs h-full py-2 size-14">
            <Link to={to}>
                {icon}
                {title}
            </Link>
        </Button>
    )
}

const adminItems: BottomMenuItemProps[] = [
    {
        title: i18n.t('users'),
        to: '/users',
        icon: <UsersIcon />,
    },
    {
        title: i18n.t('home'),
        to: '/',
        icon: <Home />,
    },
]

const sudoAdminItems: BottomMenuItemProps[] = [
    {
        title: i18n.t('users'),
        to: '/users',
        icon: <UsersIcon />,
    },
    {
        title: i18n.t('services'),
        to: '/services',
        icon: <Server />,
    },
    {
        title: i18n.t('home'),
        to: '/',
        icon: <Home />,
    },
    {
        title: i18n.t('nodes'),
        to: '/nodes',
        icon: <Box />,
    },
    {
        title: i18n.t('hosts'),
        to: '/hosts',
        icon: <ServerCog />,
    },
]

export const DashboardBottomMenu = ({ variant = "admin" }: { variant: "sudo-admin" | "admin" }) => {
    const { isCurrentRouteActive } = useIsCurrentRoute()
    const items = variant === "sudo-admin" ? sudoAdminItems : adminItems;
    return (
        <div className="w-full flex flex-row justify-evenly items-center">
            {items.map((item: BottomMenuItemProps) => (
                <BottomMenuItem
                    active={isCurrentRouteActive(item.to)}
                    {...item}
                />
            ))}
        </div>
    )
}

