import { FC, useState } from "react";
import { DataTable } from "@marzneshin/components";

interface MutationDialogProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entity: T | null;
}

interface DeleteConfirmationDialogProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entity: T | null;
}

interface SettingsDialogProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entity: T | null;
}

interface EntityTableProps<T> {
    useQuery: () => { data: T[] };
    MutationDialog: FC<MutationDialogProps<T>>;
    DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps<T>>;
    SettingsDialog: FC<SettingsDialogProps<T | any>>;
    columns: any;
    filteredColumn: string;
}

export function EntityTable<T>({
    useQuery,
    MutationDialog,
    DeleteConfirmationDialog,
    SettingsDialog,
    columns,
    filteredColumn,
}: EntityTableProps<T>) {
    const { data } = useQuery();
    const [mutationDialogOpen, setMutationDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
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

    return (
        <div>
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
            <DataTable
                columns={columns({ onEdit, onDelete, onOpen })}
                data={data}
                filteredColumn={filteredColumn}
                onCreate={onCreate}
                onOpen={onOpen}
            />
        </div>
    );
}
