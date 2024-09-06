import { useQuery } from "@tanstack/react-query";
import { DataTableViewOptions } from "./components";
import { EntityTableContext } from "./contexts";
import {
    TableSearch,
    DataTablePagination,
    EntityDataTable,
} from "./components";
import {
    usePrimaryFiltering,
    usePagination,
    useEntityTable,
    useVisibility,
    useSorting,
    useFilters,
    type QueryKey,
    type UseRowSelectionReturn,
    type FetchEntityReturn,
    type EntityQueryKeyType,
} from "./hooks";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useMemo, useEffect } from "react";

type EntityId = number;
type EntityIds = number[];

interface SelectableEntityTableProps<T> {
    fetchEntity: ({ queryKey }: EntityQueryKeyType) => FetchEntityReturn<T>;
    columns: ColumnDef<T>[];
    primaryFilter: string;
    entityKey: string;
    rowSelection: UseRowSelectionReturn;
    parentEntity: Record<string, any>,
    parentEntityRelationName: string,
    setSelectedEntities: (s: EntityIds) => void
    rowIdentifier: keyof T;
}

function getSelectedIdentifiers<T>(
    data: T[],
    selectedRow: Record<number, boolean>,
    rowIdentifier: keyof T
) {
    return data
        .filter((_, index) => selectedRow[index])
        .map((row) => row[rowIdentifier]);
}


export function SelectableEntityTable<T>({
    fetchEntity,
    columns,
    primaryFilter,
    rowSelection,
    entityKey,
    parentEntity,
    setSelectedEntities,
    parentEntityRelationName,
    rowIdentifier
}: SelectableEntityTableProps<T>) {
    const columnPrimaryFilter = usePrimaryFiltering({ column: primaryFilter });
    const filters = useFilters();
    const { setSelectedRow, selectedRow } = rowSelection;
    const sorting = useSorting();
    const visibility = useVisibility();
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

    useEffect(() => {
        setSelectedRow((prevSelected: RowSelectionState) => {
            const updatedSelected: RowSelectionState = prevSelected;
            const entitiesList: number[] = parentEntity[parentEntityRelationName];
            for (const rowId of entitiesList) {
                for (const [i, fetchedRow] of data.entities.entries()) {
                    if (fetchedRow[rowIdentifier] === rowId) {
                        updatedSelected[i] = true;
                    }
                }
            }
            return updatedSelected;
        });
        setSelectedEntities(getSelectedIdentifiers(entitiesList, selectedRow, rowIdentifier));
    }, [data.entities, parentEntity, selectedRow, setSelectedEntities, setSelectedRow, parentEntityRelationName, rowIdentifier]);

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

    const contextValue = useMemo(
        () => ({ table, data: data.entities, primaryFilter: columnPrimaryFilter, filters, isLoading: isFetching }),
        [table, data.entities, filters, columnPrimaryFilter, isFetching],
    );
    return (
        <EntityTableContext.Provider value={contextValue}>
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row-reverse items-center py-4 gap-2 w-full">
                    <div className="flex flex-row justify-center items-center w-full">
                        <DataTableViewOptions table={table} />
                    </div>
                    <TableSearch />
                </div>
                <div className="w-full rounded-md border">
                    <div className="flex flex-col justify-between size-full">
                        <EntityDataTable columns={columns} />
                        <DataTablePagination table={table} />
                    </div>
                </div>
            </div>
        </EntityTableContext.Provider>
    );
}

