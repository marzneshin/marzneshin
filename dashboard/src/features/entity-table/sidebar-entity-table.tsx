import { Button, DataTableViewOptions, ResizableHandle, ResizablePanel, ResizablePanelGroup, HStack } from "@marzneshin/components";
import { Server } from "lucide-react";
import { EntityTableContext, SidebarEntityTableContext } from "./contexts";
import {
    SidebarEntityCardSectionsProps,
    TableFiltering,
    DataTablePagination,
    EntityDataTable,
    SidebarEntityTablePopover,
    SidebarEntitySelection
} from "./components";
import {
    useSidebarEntityTable,
    EntitySidebarQueryKeyType,
    FetchEntityReturn,
    UseRowSelectionReturn,
} from "./hooks";
import { useTranslation } from "react-i18next";


interface SidebarEntityTableProps<T, S> {
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

export function SidebarEntityTable<T, S>(props: SidebarEntityTableProps<T, S>) {
    const { t } = useTranslation();
    const {
        desktop,
        table,
        entityTableContextValue,
        sidebarEntityTableContextValue,
        columns,
        onCreate
    } = useSidebarEntityTable(props);

    return (
        <EntityTableContext.Provider value={entityTableContextValue}>
            <SidebarEntityTableContext.Provider value={sidebarEntityTableContextValue}>
                <div className="flex flex-col">
                    <div className="flex flex-col md:flex-row-reverse items-center py-4 gap-2 w-full">
                        <div className="flex flex-row justify-center items-center w-full">
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
                                <Button aria-label={`create-${props.entityKey}`} onClick={onCreate}>
                                    {t("create")}
                                </Button>
                            )}
                        </div>
                        <TableFiltering />
                    </div>
                    <div className="w-full rounded-md border">
                        <ResizablePanelGroup direction="horizontal">
                            <ResizablePanel minSize={20} maxSize={desktop ? 40 : 0}>
                                <SidebarEntitySelection />
                            </ResizablePanel>
                            <ResizableHandle withHandle={desktop} />
                            <ResizablePanel >
                                <div className="flex flex-col justify-between size-full">
                                    <EntityDataTable columns={columns} onRowClick={props.onOpen} />
                                    <DataTablePagination />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </div>
            </SidebarEntityTableContext.Provider>
        </EntityTableContext.Provider>
    );
}
