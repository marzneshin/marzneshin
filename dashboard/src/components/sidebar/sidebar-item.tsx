import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import type { SidebarItem as SidebarItemType } from "./types";
import { cn } from "@marzneshin/common/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { useSidebarContext } from "./sidebar-provider";

const sidebarItemVariants = cva("w-full rounded-lg border p-2", {
    variants: {
        variant: {
            default: "bg-primary-foreground text-primary hover:bg-accent",
            active: "bg-primary text-primary-foreground",
        },
        size: {
            default: "",
            collapsed: "",
        },
    },
});

export interface SidebarItemProps
    extends React.HTMLAttributes<HTMLLinkElement>,
    VariantProps<typeof sidebarItemVariants> {
    item: SidebarItemType;
}

export const SidebarItem: FC<SidebarItemProps> = ({
    item,
    className,
    variant,
}) => {
    const { collapsed, setOpen } = useSidebarContext();
    return (
        <li
            key={item.title}
            className={cn(sidebarItemVariants({ variant, className }))}
        >
            <Link
                to={item.to}
                onClick={() => setOpen?.(false)}
                className={cn("flex flex-row items-center justify-center", {
                    "-justify-center gap-2": !collapsed,
                })}
            >
                {item.icon}
                {!collapsed && item.title}
            </Link>
        </li>
    );
};
