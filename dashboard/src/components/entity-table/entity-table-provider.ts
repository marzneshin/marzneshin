import { createContext, useContext } from "react";
import { UseFilteringReturn } from "./hooks";
import { Table } from "@tanstack/react-table";

interface EntityTableContextProps<TData> {
    table: Table<TData>;
    filtering?: UseFilteringReturn | undefined
}

export const EntityTableContext = createContext<EntityTableContextProps<any> | null>(null);

export const useEntityTableContext = () => {
    const ctx = useContext(EntityTableContext);
    if (!ctx)
        throw new Error('EntityTable.* component must be rendered as child of EntityTable');
    return ctx;
}
