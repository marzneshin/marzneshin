import { FC } from "react";
import {
    useServicesQuery,
    MutationDialog,
    ServicesDeleteConfirmationDialog
} from '@marzneshin/features/services';
import { columns } from "./columns";
import { ServiceSettingsDialog } from "../../dialogs/settings.dialog";
import { EntityTable } from "@marzneshin/components";

export const ServicesTable: FC = () => {
    return (
        <EntityTable
            useQuery={useServicesQuery}
            DeleteConfirmationDialog={ServicesDeleteConfirmationDialog}
            SettingsDialog={ServiceSettingsDialog}
            MutationDialog={MutationDialog}
            columns={columns}
            filteredColumn="name"
        />
    )
}
