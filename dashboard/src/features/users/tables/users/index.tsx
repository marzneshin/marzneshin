
import { FC } from "react";
import {
    UsersMutationDialog,
    UsersDeleteConfirmationDialog,
    UsersSettingsDialog,
    fetchUsers,
    UsersQueryFetchKey
} from '@marzneshin/features/users';
import { columns } from './columns'
import { EntityTable } from "@marzneshin/components";

export const UsersTable: FC = () => {
    return (
        <EntityTable
            fetchEntity={fetchUsers}
            MutationDialog={UsersMutationDialog}
            DeleteConfirmationDialog={UsersDeleteConfirmationDialog}
            SettingsDialog={UsersSettingsDialog}
            columnsFn={columns}
            filteredColumn="username"
            entityKey={UsersQueryFetchKey}
        />
    )
}
