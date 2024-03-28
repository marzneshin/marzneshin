import { FC } from "react";
import {
    useNodesQuery,
    columns,
    NodesSettingsDialog
} from '@marzneshin/features/nodes';
import { MutationDialog } from "../dialogs/mutation.dialog";
import { NodesDeleteConfirmationDialog } from "../dialogs/delete-confirmation.dialog";
import { EntityTable } from "@marzneshin/components";

export const NodesTable: FC = () => {
    return (
        <EntityTable
            useQuery={useNodesQuery}
            MutationDialog={MutationDialog}
            DeleteConfirmationDialog={NodesDeleteConfirmationDialog}
            SettingsDialog={NodesSettingsDialog}
            columns={columns}
            filteredColumn="name"
        />
    )
}
