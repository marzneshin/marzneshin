import { type FC, useCallback, useState } from "react";
import { fetchInbounds } from "@marzneshin/features/inbounds";
import { Button } from "@marzneshin/components";
import { SelectableEntityTable, useRowSelection } from "@marzneshin/features/entity-table";
import { columns } from "./columns";
import { type ServiceType, useServicesUpdateMutation } from "@marzneshin/features/services";
import { useTranslation } from "react-i18next";

interface ServiceInboundsTableProps {
    service: ServiceType;
}

export const ServiceInboundsTable: FC<ServiceInboundsTableProps> = ({
    service,
}) => {
    const { mutate: updateService } = useServicesUpdateMutation();
    const { selectedRow, setSelectedRow } =
        useRowSelection(Object.fromEntries(service.inbound_ids.map(entityId => [String(entityId), true])));
    const [selectedInbound, setSelectedInbound] = useState<number[]>(service.inbound_ids);
    const { t } = useTranslation();

    const handleApply = useCallback(() => {
        updateService({ id: service.id, name: service.name, inbound_ids: selectedInbound });
    }, [selectedInbound, service, updateService]);

    const disabled = Object.keys(selectedRow).length < 1;

    return (
        <div className="flex flex-col gap-4">
            <SelectableEntityTable
                columns={columns}
                entityKey="inbounds"
                existingEntityIds={service.inbound_ids}
                fetchEntity={fetchInbounds}
                primaryFilter="tag"
                rowSelection={{ selectedRow: selectedRow, setSelectedRow: setSelectedRow }}
                entitySelection={{ selectedEntity: selectedInbound, setSelectedEntity: setSelectedInbound }}
            />

            <Button onClick={handleApply} disabled={disabled}>
                {t("apply")}
            </Button>
        </div>
    );
};
