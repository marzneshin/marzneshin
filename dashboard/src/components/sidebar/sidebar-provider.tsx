import { createContext, useContext } from "react";
import { SidebarItemGroup } from "./types";

interface SidebarContextProps {
    sidebar: SidebarItemGroup;
    collapsed: boolean;
    setCollapsed: (state: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextProps | null>(null);

export const useSidebarContext = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx)
        throw new Error('Sidebar.* component must be rendered as child of Sidebar ');
    return ctx;
}
