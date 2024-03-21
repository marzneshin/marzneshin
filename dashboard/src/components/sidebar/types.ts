import { routeTree } from "@marzneshin/routeTree.gen";
import { RoutePaths } from "@tanstack/react-router";
import { ReactNode } from "react";


export interface SidebarItem {
    title: string;
    to: RoutePaths<typeof routeTree>;
    icon: ReactNode;
    isParent: boolean;
    subItem?: SidebarItem[];
}

export type SidebarItemGroup = Record<string, SidebarItem[]>;
