
import { FC } from "react";
import {
    useUsersQuery,
    UsersMutationDialog,
    UsersDeleteConfirmationDialog,
    UsersSettingsDialog
} from '@marzneshin/features/users';
import { columns } from './columns'
import { EntityTable } from "@marzneshin/components";

export const UsersTable: FC = () => {
    return (
        <EntityTable
            useQuery={useUsersQuery}
            MutationDialog={MutationDialog}
            DeleteConfirmationDialog={UsersDeleteConfirmationDialog}
            SettingsDialog={UsersSettingsDialog}
            columns={columns}
            filteredColumn="username"
        />
    )
}
