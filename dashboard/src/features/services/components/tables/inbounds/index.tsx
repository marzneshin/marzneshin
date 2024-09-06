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
    const rowSelection = useRowSelection({});
    const [selectedInbound, setSelectedInbound] = useState<number[]>([]);
    const { t } = useTranslation();

    const handleApply = useCallback(() => {
        updateService({ ...service, inbound_ids: selectedInbound });
    }, [selectedInbound, service, updateService]);

    const disabled = Object.keys(selectedInbound).length < 1;

    return (
        <div className="flex flex-col gap-4">
            <SelectableEntityTable
                fetchEntity={fetchInbounds}
                columns={columns}
                filteredColumn="tag"
                parentEntity={service}
                rowIdentifier="id"
                rowSelection={rowSelection}
                parentEntity={service}
                parentEntityRelationName="inbound_ids"
                setSelectedEntities={setSelectedInbound}
            />
            <Button onClick={handleApply} disabled={disabled}>
                {t("apply")}
            </Button>
        </div>
    );
};
