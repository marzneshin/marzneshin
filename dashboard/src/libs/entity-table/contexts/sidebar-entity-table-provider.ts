import { createContext, useContext } from "react";
import {
    type SidebarEntityCardSectionsProps
} from "@marzneshin/libs/entity-table/components";

interface SidebarEntityTableContextProps<SData> {
    sidebarEntityId?: string;
    setSidebarEntityId: (s: string | undefined) => void;
    sidebarEntities: SData[];
    sidebarCardProps: SidebarEntityCardSectionsProps<SData>;
}

export const SidebarEntityTableContext = createContext<SidebarEntityTableContextProps<any> | null>(null);

export const useSidebarEntityTableContext = () => {
    const ctx = useContext(SidebarEntityTableContext);
    if (!ctx)
        throw new Error('SidebarEntityTable.* component must be rendered as child of SidebarEntityTable');
    return ctx;
}
