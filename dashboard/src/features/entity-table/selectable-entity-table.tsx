import { useEffect, useMemo } from "react";
import { DataTableViewOptions } from "./components";
import { useQuery } from "@tanstack/react-query";
import { RowSelectionState, ColumnDef } from "@tanstack/react-table";
import { EntityTableContext } from "./contexts";
import { TableSearch, DataTablePagination, EntityDataTable } from "./components";
import {
    type UseRowSelectionReturn,
    usePrimaryFiltering,
    usePagination,
    type FetchEntityReturn,
    useEntityTable,
    useVisibility,
    useSorting,
    type QueryKey,
    type EntityQueryKeyType,
    useFilters,
} from "./hooks";

export interface SelectableEntityTableProps<T extends { id: number }> {
    fetchEntity: ({ queryKey }: EntityQueryKeyType) => FetchEntityReturn<T>;
    columns: ColumnDef<T>[];
    primaryFilter: string;
    entityKey: string;
    rowSelection: UseRowSelectionReturn;
    entitySelection: {
        selectedEntity: number[];
        setSelectedEntity: (s: number[]) => void;
    }
    existingEntityIds: number[];
}

export function SelectableEntityTable<T extends { id: number }>({
    fetchEntity,
    columns,
    primaryFilter,
    rowSelection,
    entitySelection,
    entityKey,
    existingEntityIds,
}: SelectableEntityTableProps<T>) {
    const columnPrimaryFilter = usePrimaryFiltering({ column: primaryFilter });
    const filters = useFilters();
    const sorting = useSorting();
    const visibility = useVisibility();
    const { selectedRow, setSelectedRow } = rowSelection;
    const { setSelectedEntity } = entitySelection;
    const { onPaginationChange, pageIndex, pageSize } = usePagination();
    const query: QueryKey = [
        entityKey,
        {
            page: pageIndex,
            size: pageSize,
        },
        columnPrimaryFilter.columnFilters,
        {
            sortBy: sorting.sorting[0]?.id || "created_at",
            desc: sorting.sorting[0]?.desc || true,
        },
        { filters: filters.columnsFilter }
    ];

    const { data, isFetching } = useQuery({
        queryFn: fetchEntity,
        queryKey: query,
        initialData: { entities: [], pageCount: 1 },
    });

    const table = useEntityTable({
        data,
        columns,
        pageSize,
        pageIndex,
        rowSelection,
        visibility,
        sorting,
        onPaginationChange,
    });

    useEffect(() => {
        setSelectedRow((selected) => {
            const updatedSelected: RowSelectionState = { ...selected };
            for (const [i, fetchedEntity] of data.entities.entries()) {
                if (existingEntityIds.includes(fetchedEntity.id)) {
                    updatedSelected[i] = true;
                } else {
                    updatedSelected[i] = false;
                }
            }
            return updatedSelected;
        });

    }, [data, setSelectedRow, existingEntityIds]);

    useEffect(() => {
        const selectedRowId = Object.keys(selectedRow).filter(key => selectedRow[key] === true).map(Number);

        setSelectedEntity(
            selectedRowId
                .map(id => data.entities[id]?.id)
                .filter(id => id !== null && id !== undefined)
        );
    }, [data, setSelectedEntity, setSelectedRow, existingEntityIds, selectedRow]);


    const contextValue = useMemo(
        () => ({ table, data: data.entities, primaryFilter: columnPrimaryFilter, filters, isLoading: isFetching }),
        [table, data.entities, filters, columnPrimaryFilter, isFetching],
    );

    return (
        <EntityTableContext.Provider value={contextValue}>
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row-reverse items-center py-4 gap-2 w-full">
                    <div className="flex flex-row items-center w-full">
                        <DataTableViewOptions table={table} />
                    </div>
                    <TableSearch />
                </div>
                <div className="w-full rounded-md border">
                    <EntityDataTable columns={columns} />
                    <DataTablePagination table={table} />
                </div>
            </div>
        </EntityTableContext.Provider>
    );
}
