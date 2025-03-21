import { createContext, useContext } from "react";
import { UseFiltersReturn, UsePrimaryFilterReturn } from "../hooks";
import { Table } from "@tanstack/react-table";

interface EntityTableContextProps<TData> {
    entityKey: string
    table: Table<TData>
    data: TData[]
    primaryFilter: UsePrimaryFilterReturn
    filters: UseFiltersReturn
    isLoading: boolean
}

export const EntityTableContext = createContext<EntityTableContextProps<any> | null>(null);

export const useEntityTableContext = () => {
    const ctx = useContext(EntityTableContext);
    if (!ctx)
        throw new Error('EntityTable.* component must be rendered as child of EntityTable');
    return ctx;
}
