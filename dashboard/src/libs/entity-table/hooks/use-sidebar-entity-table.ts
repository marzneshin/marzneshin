import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
    usePrimaryFiltering,
    usePagination,
    useEntityTable,
    useVisibility,
    useSorting,
    useFilters,
    type EntitySidebarQueryKeyType,
    type FetchEntityReturn,
    type SidebarQueryKey,
    type UseRowSelectionReturn
} from ".";
import { useScreenBreakpoint } from "@marzneshin/common/hooks";
import {
    type SidebarEntityCardSectionsProps
} from "@marzneshin/libs/entity-table/components";

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
    const primaryFilter = usePrimaryFiltering({ column: filteredColumn });
    const filters = useFilters();
    const sorting = useSorting();
    const visibility = useVisibility();
    const desktop = useScreenBreakpoint("md");
    const { onPaginationChange, pageIndex, pageSize } = usePagination({entityKey});

    const query: SidebarQueryKey = [
        entityKey,
        sidebarEntityId,
        secondaryEntityKey,
        {
            page: pageIndex,
            size: pageSize,
        },
        primaryFilter.columnFilters,
        {
            sortBy: sorting.sorting[0]?.id ? sorting.sorting[0].id : "created_at",
            desc: sorting.sorting[0]?.desc
        },
        { filters: filters.columnsFilter }
    ];

    const { data, isFetching } = useQuery({
        queryFn: fetchEntity,
        queryKey: query,
        initialData: { entities: [], pageCount: 1 },
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
        () => ({ entityKey, table, data: data.entities, primaryFilter, filters, isLoading: isFetching }),
        [entityKey, table, data.entities, filters, primaryFilter, isFetching],
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
