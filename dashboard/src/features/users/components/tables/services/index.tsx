import { type FC, useCallback, useState } from "react";
import { Button } from "@marzneshin/components";
import { SelectableEntityTable, useRowSelection } from "@marzneshin/features/entity-table";
import { columns } from "./columns";
import {
    type UserType,
    useUsersUpdateMutation,
} from "@marzneshin/features/users";
import { useTranslation } from "react-i18next";
import { fetchServices } from "@marzneshin/features/services";

interface UserServicesTableProps {
    user: UserType;
}

export const UserServicesTable: FC<UserServicesTableProps> = ({ user }) => {
    const { mutate: updateUser } = useUsersUpdateMutation();
    const rowSelection = useRowSelection({});
    const [selectedService, setSelectedService] = useState<number[]>([]);
    const { t } = useTranslation();

    const handleApply = useCallback(() => {
        updateUser({ ...user, service_ids: selectedService });
    }, [selectedService, user, updateUser]);

    const disabled = Object.keys(rowSelection.selectedRow).length < 1;

    return (
        <div className="flex flex-col gap-4">
            <SelectableEntityTable
                fetchEntity={fetchServices}
                columns={columns}
                filteredColumn="name"
                parentEntity={user}
                rowIdentifier="id"
                rowSelection={rowSelection}
                parentEntityRelationName="service_ids"
                setSelectedEntities={setSelectedService}
            />

            <Button onClick={handleApply} disabled={disabled}>
                {t("apply")}
            </Button>
        </div>
    );
};
