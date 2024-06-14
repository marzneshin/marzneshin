import { useMemo } from "react";
import {
    Button, DataTableViewOptions,
    ResizableHandle, ResizablePanel, ResizablePanelGroup,
    HStack
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
    SidebarEntityTableContext,
    EntityTableContext
} from "./contexts";
import {
    TableFiltering,
    DataTablePagination,
    EntityDataTable,
    type SidebarEntityCardSectionsProps,
    SidebarEntityTablePopover,
    SidebarEntitySelection
} from "./components";
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
    type UseRowSelectionReturn,
} from "./hooks";
import { useScreenBreakpoint } from "@marzneshin/hooks";
import { Server } from "lucide-react";

interface SidebarEntityTableProps<T, S> {
    fetchEntity: ({ queryKey }: EntitySidebarQueryKeyType) => FetchEntityReturn<T>;
    sidebarEntities: S[];
    setSidebarEntityId: (entity: string | undefined) => void;
    sidebarEntityId?: string;
    sidebarCardProps: SidebarEntityCardSectionsProps<S>
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

export function SidebarEntityTable<T, S>({
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
}: SidebarEntityTableProps<T, S>) {
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

    const { data, isPending } = useQuery({
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
            isLoading: isPending,
        }),
        [table, data.entity, filtering, isPending],
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

    return (
        <EntityTableContext.Provider value={entityTableContextValue}>
            <SidebarEntityTableContext.Provider value={sidebarEntityTableContextValue}>
                <div className="flex flex-col">
                    <div className="flex items-center justify-between py-4">
                        <TableFiltering />
                        <HStack className="gap-0 items-center">
                            {!desktop && (
                                <SidebarEntityTablePopover
                                    buttonChild={
                                        <HStack className="items-center p-1">
                                            <Server className="size-4" /> {t("inbounds")}
                                        </HStack>
                                    }
                                />
                            )}
                            <DataTableViewOptions table={table} />
                            {onCreate && (
                                <Button aria-label={`create-${entityKey}`} onClick={onCreate}>
                                    {t("create")}
                                </Button>
                            )}
                        </HStack>
                    </div>
                    <div className="w-full rounded-md border">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel minSize={20} maxSize={desktop ? 40 : 0}>
                                <SidebarEntitySelection />
                            </ResizablePanel>
                            <ResizableHandle withHandle={desktop} />
                            <ResizablePanel >
                                <div className="flex flex-col justify-between size-full">
                                    <EntityDataTable columns={columns} onRowClick={onOpen} />
                                    <DataTablePagination />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </div>
            </SidebarEntityTableContext.Provider>
        </EntityTableContext.Provider >
    );
}
