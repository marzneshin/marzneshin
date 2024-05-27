import { type FC, useCallback, useEffect, useState } from "react";
import { useInboundsQuery } from "@marzneshin/features/inbounds";
import { Button, DataTable } from "@marzneshin/components";
import { columns } from "./columns";
import { type ServiceType, useServicesUpdateMutation } from "../..";
import { useTranslation } from "react-i18next";
import type { RowSelectionState } from "@tanstack/react-table";

interface ServiceInboundsTableProps {
    service: ServiceType;
}

export const ServiceInboundsTable: FC<ServiceInboundsTableProps> = ({
    service,
}) => {
    const { mutate: updateService } = useServicesUpdateMutation();
    const { data } = useInboundsQuery();
    const [selectedInbound, setSelectedInbound] = useState<{
        [key: number]: boolean;
    }>({});
    const { t } = useTranslation();

    useEffect(() => {
        setSelectedInbound((prevSelected) => {
            const updatedSelected: RowSelectionState = { ...prevSelected };
            for (const inboundId of service.inbounds) {
                for (const [i, fetchedInbound] of data.entries()) {
                    if (fetchedInbound.id === inboundId) {
                        updatedSelected[i] = true;
                    }
                }
            }
            return updatedSelected;
        });
    }, [data, service.inbounds]);

    const handleApply = useCallback(() => {
        const selectedInboundIds = Object.keys(selectedInbound)
            .filter((key) => selectedInbound[Number.parseInt(key)])
            .map((key) => data[Number.parseInt(key)].id);
        updateService({ ...service, inbounds: selectedInboundIds });
    }, [data, selectedInbound, service, updateService]);

    const disabled = Object.keys(selectedInbound).length < 1;

    return (
        <div className="flex flex-col gap-4">
            <DataTable
                columns={columns}
                data={data}
                filteredColumn="tag"
                selectedRow={selectedInbound}
                setSelectedRow={setSelectedInbound}
            />

            <Button onClick={handleApply} disabled={disabled}>
                {t("apply")}
            </Button>
        </div>
    );
};
