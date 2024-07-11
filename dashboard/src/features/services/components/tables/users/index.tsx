
import { FC } from "react";
import { DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { useUsersServiceQuery, type ServiceType } from "@marzneshin/features/services";

interface ServicesUsersTableProps {
    service: ServiceType
}

export const ServicesUsersTable: FC<ServicesUsersTableProps> = ({ service }) => {
    const { data } = useUsersServiceQuery({ serviceId: service.id });

    return (
        <DataTable
            columns={columns}
            data={data}
            filteredColumn='username'
        />
    )
}
