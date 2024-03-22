import { FC, useState } from "react";
import {
    useNodesQuery,
    columns,
    NodeType,
    NodesSettingsConfirmationDialog
} from '@marzneshin/features/nodes';
import { DataTable } from "@marzneshin/components";
import { MutationDialog } from "../dialogs/mutation.dialog";
import { NodesDeleteConfirmationDialog } from "../dialogs/delete-confirmation.dialog";

export const NodesTable: FC = () => {
    const { data } = useNodesQuery();
    const [mutationDialogOpen, setMutationDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
    const [selectedNode, selectNode] = useState<NodeType | null>(null);

    const onEdit = (node: NodeType) => {
        selectNode(node);
        setMutationDialogOpen(true);
    }

    const onDelete = (node: NodeType) => {
        selectNode(node);
        setDeleteDialogOpen(true);
    }

    const onCreate = () => {
        selectNode(null);
        setMutationDialogOpen(true);
    }

    const onOpen = (node: NodeType) => {
        selectNode(node);
        setSettingsDialogOpen(true);
    }

    return (
        <div>
            <NodesSettingsConfirmationDialog
                open={settingsDialogOpen}
                onOpenChange={setSettingsDialogOpen}
                node={selectedNode}
            />
            <NodesDeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                node={selectedNode}
            />
            <MutationDialog
                node={selectedNode}
                open={mutationDialogOpen}
                onOpenChange={setMutationDialogOpen}
            />
            <DataTable
                columns={columns({ onEdit, onDelete, onOpen })}
                data={data}
                filteredColumn='name'
                onCreate={onCreate}
                onOpen={onOpen}
            />
        </div>
    )
}
