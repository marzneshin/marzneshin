import type { FC, PropsWithChildren } from "react";
import { useMemo } from "react";
import { SidebarContext } from "./sidebar-provider";
import type { SidebarItemGroup } from "./types";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@marzneshin/common/utils";
import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarBody } from "./sidebar-body";
import { SidebarItem } from "./sidebar-item";
import { SidebarGroup } from "./sidebar-group";

const sidebarVariants = cva("flex flex-col justify-between h-full w-full", {
    variants: {
        variant: {
            default: "",
        },
    },
});

interface ContentComposition {
    Header: typeof SidebarHeader;
    Footer: typeof SidebarFooter;
    Body: typeof SidebarBody;
    Group: typeof SidebarGroup;
    Item: typeof SidebarItem;
}

export interface SidebarProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
    sidebar: SidebarItemGroup;
    collapsed: boolean;
    setCollapsed: (state: boolean) => void;
    open?: boolean;
    setOpen?: (state: boolean) => void;
}

const Sidebar: FC<SidebarProps & PropsWithChildren> & ContentComposition = ({
    collapsed,
    setCollapsed,
    sidebar,
    variant,
    className,
    setOpen,
    open,
    children,
    ...props
}) => {
    const contextValue = useMemo(
        () => ({ sidebar, collapsed, setCollapsed, open, setOpen }),
        [sidebar, collapsed, setCollapsed, open, setOpen],
    );
    return (
        <SidebarContext.Provider value={contextValue}>
            <div className={cn(sidebarVariants({ variant, className }))} {...props}>
                {children}
            </div>
        </SidebarContext.Provider>
    );
};

Sidebar.Header = SidebarHeader;
Sidebar.Footer = SidebarFooter;
Sidebar.Body = SidebarBody;
Sidebar.Item = SidebarItem;
Sidebar.Group = SidebarGroup;
Sidebar.displayName = "Sidebar";

export { Sidebar, sidebarVariants };
