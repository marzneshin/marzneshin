import { FC } from "react";
import {
    MutationDialog,
    ServicesDeleteConfirmationDialog,
    ServicesQueryFetchKey,
    fetchServices
} from '@marzneshin/features/services';
import { columns } from "./columns";
import { ServiceSettingsDialog } from "../../dialogs/settings.dialog";
import { EntityTable } from "@marzneshin/components";

export const ServicesTable: FC = () => {
    return (
        <EntityTable
            fetchEntity={fetchServices}
            DeleteConfirmationDialog={ServicesDeleteConfirmationDialog}
            SettingsDialog={ServiceSettingsDialog}
            MutationDialog={MutationDialog}
            columnsFn={columns}
            filteredColumn="name"
            entityKey={ServicesQueryFetchKey}
        />
    )
}
