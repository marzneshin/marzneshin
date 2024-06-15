import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
    useFiltering,
    usePagination,
    useEntityTable,
    useVisibility,
    useSorting,
    type SortableSidebarQueryKey,
    type EntitySidebarQueryKeyType,
    type FetchEntityReturn,
    type SidebarQueryKey,
    type UseRowSelectionReturn
} from ".";
import { useScreenBreakpoint } from "@marzneshin/hooks";
import {
    type SidebarEntityCardSectionsProps
} from "@marzneshin/features/entity-table/components";

interface UseSidebarEntityTableParams<T, S> {
    fetchEntity: ({ queryKey }: EntitySidebarQueryKeyType) => FetchEntityReturn<T>;
    sidebarEntities: S[];
    setSidebarEntityId: (entity: string | undefined) => void;
    sidebarEntityId?: string;
    sidebarCardProps: SidebarEntityCardSectionsProps<S>;
    secondaryEntityKey: string;
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

export const useSidebarEntityTable = <T, S>({
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
    sidebarEntityId,
    setSidebarEntityId,
    sidebarEntities,
    sidebarCardProps,
    secondaryEntityKey,
}: UseSidebarEntityTableParams<T, S>) => {
    const { t } = useTranslation();
    const filtering = useFiltering({ column: filteredColumn });
    const sorting = useSorting();
    const visibility = useVisibility();
    const desktop = useScreenBreakpoint("md");
    const { onPaginationChange, pageIndex, pageSize } = usePagination();

    const sortedQuery: SortableSidebarQueryKey = [
        entityKey,
        sidebarEntityId,
        secondaryEntityKey,
        pageIndex,
        pageSize,
        filtering.columnFilters,
        sorting.sorting[0]?.id ? sorting.sorting[0].id : "created_at",
        sorting.sorting[0]?.desc,
    ];

    const query: SidebarQueryKey = [
        entityKey,
        sidebarEntityId,
        secondaryEntityKey,
        pageIndex,
        pageSize,
        filtering.columnFilters,
    ];

    const { data, isFetching } = useQuery({
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

    const entityTableContextValue = useMemo(
        () => ({
            table,
            data: data.entity,
            filtering,
            isLoading: isFetching,
        }),
        [table, data.entity, filtering, isFetching],
    );

    const sidebarEntityTableContextValue = useMemo(
        () => ({
            sidebarEntities,
            setSidebarEntityId,
            sidebarEntityId,
            sidebarCardProps
        }),
        [sidebarEntities, setSidebarEntityId, sidebarEntityId, sidebarCardProps],
    );

    return {
        t,
        desktop,
        table,
        entityTableContextValue,
        sidebarEntityTableContextValue,
        columns,
        onCreate
    };
};
