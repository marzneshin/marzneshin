import { useMemo } from "react";
import { Button, DataTableViewOptions } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { EntityTableContext } from "./contexts";
import { EntityDataTable } from "./table";
import { DataTablePagination } from "./table-pagination";
import { TableFiltering } from "./table-filtering";
import {
    type UseRowSelectionReturn,
    useFiltering,
    usePagination,
    type FetchEntityReturn,
    useEntityTable,
    useVisibility,
    useSorting,
    type SortableQueryKey,
    type QueryKey,
    type EntityQueryKeyType,
} from "./hooks";

interface EntityTableProps<T> {
    fetchEntity: ({ queryKey }: EntityQueryKeyType) => FetchEntityReturn<T>;
    columnsFn: any;
    filteredColumn: string;
    entityKey: string;
    rowSelection?: UseRowSelectionReturn;
    manualSorting?: boolean;
    onCreate: () => void;
    onEdit: (entity: T) => void;
    onOpen: (entity: T) => void;
    onDelete: (entity: T) => void;
}

export function EntityTable<T>({
    fetchEntity,
    columnsFn,
    filteredColumn,
    rowSelection,
    entityKey,
    manualSorting = false,
    onCreate,
    onEdit,
    onOpen,
    onDelete,
}: EntityTableProps<T>) {
    const { t } = useTranslation();
    const filtering = useFiltering({ column: filteredColumn });
    const sorting = useSorting();
    const visibility = useVisibility();
    const { onPaginationChange, pageIndex, pageSize } = usePagination();
    const sortedQuery: SortableQueryKey = [
        entityKey,
        pageIndex,
        pageSize,
        filtering.columnFilters,
        sorting.sorting[0]?.id ? sorting.sorting[0].id : "created_at",
        sorting.sorting[0]?.desc,
    ];
    const query: QueryKey = [
        entityKey,
        pageIndex,
        pageSize,
        filtering.columnFilters,
    ];

    const { data, isLoading } = useQuery({
        queryFn: fetchEntity,
        queryKey: manualSorting ? sortedQuery : query,
        initialData: { entity: [], pageCount: 1 },
    });

    const columns = columnsFn({ onEdit, onDelete, onOpen });
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
        () => ({ table, data: data.entity, filtering, isLoading }),
        [table, data.entity, filtering, isLoading],
    );

    return (
        <EntityTableContext.Provider value={contextValue}>
            <div className="flex flex-col">
                <div className="flex items-center py-4">
                    <TableFiltering />
                    <DataTableViewOptions table={table} />
                    {onCreate && (
                        <Button aria-label={`create-${entityKey}`} onClick={onCreate}>
                            {t("create")}
                        </Button>
                    )}
                </div>
                <div className="w-full rounded-md border">
                    <EntityDataTable columns={columns} onRowClick={onOpen} />
                    <DataTablePagination />
                </div>
            </div>
        </EntityTableContext.Provider>
    );
}

export * from "./hooks";
