import { AppRouterPaths } from "@marzneshin/common/types";
import { ReactNode } from "react";

export interface SidebarItem {
    title: string;
    to: AppRouterPaths;
    icon: ReactNode;
    isParent: boolean;
    subItem?: SidebarItem[];
}

export interface SidebarObject {
    [key: string]: SidebarItem[];
}

export type SidebarItemGroup = Record<string, SidebarItem[]>;
