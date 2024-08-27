import { useMemo } from "react";
import { Button } from "@marzneshin/components";
import { DataTableViewOptions } from "./components";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
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

export interface EntityTableProps<T> {
    fetchEntity: ({ queryKey }: EntityQueryKeyType) => FetchEntityReturn<T>;
    columns: ColumnDef<T>[];
    primaryFilter: string;
    entityKey: string;
    rowSelection?: UseRowSelectionReturn;
    onCreate: () => void;
    onOpen: (entity: any) => void;
}

export function EntityTable<T>({
    fetchEntity,
    columns,
    primaryFilter,
    rowSelection,
    entityKey,
    onCreate,
    onOpen,
}: EntityTableProps<T>) {
    const { t } = useTranslation();
    const columnPrimaryFilter = usePrimaryFiltering({ column: primaryFilter });
    const filters = useFilters();
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
            sortBy: sorting.sorting[0]?.id ? sorting.sorting[0].id : "created_at",
            desc: sorting.sorting[0]?.desc
        },
        { filters: filters.columnsFilter }
    ];

    const { data, isFetching } = useQuery({
        queryFn: fetchEntity,
        queryKey: query,
        initialData: { entity: [], pageCount: 1 },
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

    const contextValue = useMemo(
        () => ({ table, data: data.entity, primaryFilter: columnPrimaryFilter, filters, isLoading: isFetching }),
        [table, data.entity, filters, columnPrimaryFilter, isFetching],
    );

    return (
        <EntityTableContext.Provider value={contextValue}>
            <div className="flex flex-col">
                <div className="flex flex-col md:flex-row-reverse items-center py-4 gap-2 w-full">
                    <div className="flex flex-row items-center w-full">
                        <DataTableViewOptions table={table} />
                        {onCreate && (
                            <Button aria-label={`create-${entityKey}`} onClick={onCreate}>
                                {t("create")}
                            </Button>
                        )}
                    </div>
                    <TableSearch />
                </div>
                <div className="w-full rounded-md border">
                    <EntityDataTable columns={columns} onRowClick={onOpen} />
                    <DataTablePagination table={table} />
                </div>
            </div>
        </EntityTableContext.Provider>
    );
}
