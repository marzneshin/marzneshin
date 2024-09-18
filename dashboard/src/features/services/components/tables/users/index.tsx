
import { FC } from "react";
import { DoubleEntityTable } from "@marzneshin/features/entity-table";
import { columns } from "./columns";
import { fetchServiceUsers, type ServiceType } from "@marzneshin/features/services";

interface ServicesUsersTableProps {
    service: ServiceType
}

export const ServicesUsersTable: FC<ServicesUsersTableProps> = ({ service }) => {

    return (
        <DoubleEntityTable
            columns={columns}
            entityId={service.id}
            fetchEntity={fetchServiceUsers}
            primaryFilter='username'
            entityKey='services'
        />
    )
}
