
import { FC } from "react";
import { DoubleEntityTable } from "@marzneshin/libs/entity-table";
import { columns } from "./columns";
import { fetchServiceUsers, type ServiceType } from "@marzneshin/modules/services";

interface ServicesUsersTableProps {
    service: ServiceType
}

export const ServicesUsersTable: FC<ServicesUsersTableProps> = ({ service }) => {

    return (
        <DoubleEntityTable
            columns={columns}
            entityId={service.id}
            fetchEntity={fetchServiceUsers}
            primaryFilter="username"
            entityKey='services'
        />
    )
}
