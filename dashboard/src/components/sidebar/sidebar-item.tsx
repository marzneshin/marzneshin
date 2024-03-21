
import { Link } from '@tanstack/react-router'
import { FC, useEffect } from 'react'
import { SidebarItem as SidebarItemType } from './types'
import { cn } from '@marzneshin/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { useSidebarContext } from './sidebar-provider';

const sidebarItemVariants = cva("w-full rounded-lg border p-2", {
    variants: {
        variant: {
            default: "bg-primary-foreground text-primary hover:bg-accent",
            active: "bg-primary text-primary-foreground"
        },
        size: {
            default: "",
            collapsed: ""
        }
    }
});


export interface SidebarItemProps extends
    React.HTMLAttributes<HTMLLinkElement>,
    VariantProps<typeof sidebarItemVariants> {
    item: SidebarItemType;
}

export const SidebarItem: FC<SidebarItemProps> = ({ item, className, variant }) => {
    const { collapsed } = useSidebarContext();
    return (
        <li key={item.title} className={cn(sidebarItemVariants({ variant, className }))}>
            <Link to={item.to} className={cn("flex flex-row items-center justify-center", { "-justify-center gap-2": !collapsed })}>
                {item.icon}{!collapsed && item.title}
            </Link>
        </li>
    )
}
