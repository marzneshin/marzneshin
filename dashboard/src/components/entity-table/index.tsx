import { FC, useState } from "react";
import { Button, DataTableViewOptions } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { EntityTableContext } from "./entity-table-provider";
import { EntityDataTable } from "./table"
import { DataTablePagination } from "./table-pagination"
import { TableFiltering } from "./table-filtering";
import {
    UseRowSelectionReturn,
    UseDialogProps,
    useFiltering,
    useDialog,
    usePagination,
    FetchEntityReturn,
    EntityQueryKeyType,
    useEntityTable,
    useVisibility,
    useSorting
} from "./hooks";

interface EntityTableProps<T> {
    fetchEntity: ({ queryKey }: EntityQueryKeyType) => FetchEntityReturn<T>;
    MutationDialog: FC<UseDialogProps<T>>;
    DeleteConfirmationDialog: FC<UseDialogProps<T>>;
    SettingsDialog: FC<UseDialogProps<T | any>>;
    columnsFn: any;
    filteredColumn: string;
    entityKey: string
    rowSelection?: UseRowSelectionReturn
}

export function EntityTable<T>({
    fetchEntity,
    MutationDialog,
    DeleteConfirmationDialog,
    SettingsDialog,
    columnsFn,
    filteredColumn,
    rowSelection,
    entityKey,
}: EntityTableProps<T>) {
    const [mutationDialogOpen, setMutationDialogOpen] = useDialog();
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog();
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog();
    const [selectedEntity, selectEntity] = useState<T | null>(null);

    const onEdit = (entity: T) => {
        selectEntity(entity);
        setMutationDialogOpen(true);
    };

    const onDelete = (entity: T) => {
        selectEntity(entity);
        setDeleteDialogOpen(true);
    };

    const onCreate = () => {
        selectEntity(null);
        setMutationDialogOpen(true);
    };

    const onOpen = (entity: T) => {
        selectEntity(entity);
        setSettingsDialogOpen(true);
    };

    const { t } = useTranslation()
    const filtering = useFiltering({ column: filteredColumn })
    const sorting = useSorting()
    const visibility = useVisibility()
    const { onPaginationChange, pageIndex, pageSize } = usePagination();

    const { data } = useQuery({
        queryFn: fetchEntity,
        queryKey: [entityKey, pageIndex, pageSize],
        initialData: { entity: [], pageCount: 1 }
    });

    const columns = columnsFn({ onEdit, onDelete, onOpen })
    const table = useEntityTable({
        data,
        filtering,
        columns,
        pageSize,
        pageIndex,
        rowSelection,
        visibility,
        sorting,
        onPaginationChange
    })

    return (
        <EntityTableContext.Provider value={{ table, data: data.entity, filtering }}>
            <SettingsDialog
                open={settingsDialogOpen}
                onOpenChange={setSettingsDialogOpen}
                entity={selectedEntity}
            />
            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                entity={selectedEntity}
            />
            <MutationDialog
                open={mutationDialogOpen}
                onOpenChange={setMutationDialogOpen}
                entity={selectedEntity}
            />

            <div className="flex flex-col">
                <div className="flex items-center py-4">
                    <TableFiltering />
                    <DataTableViewOptions table={table} />
                    {onCreate && (<Button onClick={onCreate}>{t('create')}</Button>)}
                </div>
                <div className="w-full rounded-md border">
                    <EntityDataTable
                        columns={columns}
                        onRowClick={onOpen}
                    />
                    <DataTablePagination />
                </div>
            </div>
        </EntityTableContext.Provider>
    );
}

export * from './hooks'
