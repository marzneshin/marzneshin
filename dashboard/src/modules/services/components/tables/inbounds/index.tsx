import { type FC, useCallback, useState } from "react";
import { Button } from "@marzneshin/common/components";
import { SelectableEntityTable, useRowSelection } from "@marzneshin/libs/entity-table";
import { columns } from "./columns";
import { type ServiceType, useServicesUpdateMutation, fetchSelectableServiceInbounds } from "@marzneshin/modules/services";
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
                parentEntityKey="services"
                parentEntityId={service.id}
                existingEntityIds={service.inbound_ids}
                fetchEntity={fetchSelectableServiceInbounds}
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
