import { useEffect, useMemo } from "react";
import { Button } from "@marzneshin/components";
import { DataTableViewOptions } from "./components";
import { useTranslation } from "react-i18next";
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
    onCreate?: () => void;
    onOpen?: (entity: any) => void;
}

export function SelectableEntityTable<T extends { id: number }>({
    fetchEntity,
    columns,
    primaryFilter,
    rowSelection,
    entitySelection,
    entityKey,
    existingEntityIds,
    onCreate,
    onOpen,
}: SelectableEntityTableProps<T>) {
    const { t } = useTranslation();
    const columnPrimaryFilter = usePrimaryFiltering({ column: primaryFilter });
    const filters = useFilters();
    const sorting = useSorting();
    const visibility = useVisibility();
    const { selectedRow, setSelectedRow } = rowSelection;
    const { selectedEntity, setSelectedEntity } = entitySelection;
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
            for (const [, fetchedEntity] of data.entities.entries()) {
                if (existingEntityIds.includes(fetchedEntity.id)) {
                    updatedSelected[fetchedEntity.id] = true;
                } else {
                    updatedSelected[fetchedEntity.id] = false;
                }
            }
            return updatedSelected;
        });

    }, [data, setSelectedRow, existingEntityIds]);

    useEffect(() => {
        const selectedInboundIds = Object.keys(selectedRow)
            .filter(key => data.entities[Number(key)])
            .map((id: number) => data.entities[String(id)].id);

        for (const id of selectedInboundIds) {
            const index = data.entities.findIndex(fetchedEntity => fetchedEntity.id === id);
            if (index !== -1) {
                const selectedId = data.entities[index].id;
                setSelectedEntity([...new Set([...selectedEntity, selectedId])])
            }
        }
    }, [data, setSelectedEntity, selectedEntity, setSelectedRow, existingEntityIds, selectedRow]);


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
