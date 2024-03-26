
import { FC, useState } from "react";
import {
    useInboundsQuery,
} from '@marzneshin/features/inbounds';
import { DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { ServiceType } from "../..";

interface ServiceInboundsTableProps {
    service: ServiceType
}

export const ServiceInboundsTable: FC<ServiceInboundsTableProps> = ({ service }) => {
    const { data } = useInboundsQuery();
    const [selectedInbound, setSelectedInbound] = useState<number[]>(service.inbounds)
    return (
        <div>
            <DataTable
                columns={columns({ selectedInbound, setSelectedInbound })}
                data={data}
                filteredColumn='tag'
            />
        </div>
    )
}
