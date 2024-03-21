import { FC, PropsWithChildren } from "react";
import { SidebarContext } from "./sidebar-provider"
import { SidebarItemGroup } from "./types"
import { VariantProps, cva } from "class-variance-authority"
import { cn } from "@marzneshin/utils";
import { SidebarHeader } from "./sidebar-header";
import { SidebarFooter } from "./sidebar-footer";
import { SidebarBody } from "./sidebar-body";
import { SidebarItem } from "./sidebar-item";
import { SidebarGroup } from "./sidebar-group";

const sidebarVariants = cva("flex flex-col justify-between h-full w-full", {
    variants: {
        variant: {
            default: ""
        }
    }
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
}

const Sidebar: FC<SidebarProps & PropsWithChildren> & ContentComposition =
    ({ collapsed, setCollapsed, sidebar, variant, className, children, ...props }) => {
        return (
            <SidebarContext.Provider value={{ sidebar, collapsed, setCollapsed }} >
                <div className={cn(sidebarVariants({ variant, className }))} {...props}>
                    {children}
                </div>
            </SidebarContext.Provider>
        )
    }

Sidebar.Header = SidebarHeader;
Sidebar.Footer = SidebarFooter;
Sidebar.Body = SidebarBody;
Sidebar.Item = SidebarItem;
Sidebar.Group = SidebarGroup;
Sidebar.displayName = "Sidebar"

export { Sidebar, sidebarVariants }
