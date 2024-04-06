import { FC } from "react";
import {
    columns,
    NodesSettingsDialog,
    fetchNodes,
} from '@marzneshin/features/nodes';
import { MutationDialog } from "../dialogs/mutation.dialog";
import { NodesDeleteConfirmationDialog } from "../dialogs/delete-confirmation.dialog";
import { EntityTable } from "@marzneshin/components";

export const NodesTable: FC = () => {
    return (
        <EntityTable
            fetchEntity={fetchNodes}
            MutationDialog={MutationDialog}
            DeleteConfirmationDialog={NodesDeleteConfirmationDialog}
            SettingsDialog={NodesSettingsDialog}
            columnsFn={columns}
            filteredColumn="name"
            entityKey="nodes"
        />
    )
}
