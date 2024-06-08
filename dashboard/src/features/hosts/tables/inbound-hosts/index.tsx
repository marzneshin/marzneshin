
import {
    HostType,
    useHostsQuery
} from '@marzneshin/features/hosts'
import { InboundHostsDataTable } from './table'
import { useNavigate } from "@tanstack/react-router"
import { useState } from 'react'
import { useInboundsQuery } from '@marzneshin/features/inbounds'
import { columns } from './columns'
import { useDialog } from '@marzneshin/hooks'
import { InboundNotSelectedAlertDialog } from './inbound-not-selected-alert-dialog'

export const InboundHostsTable = () => {
    const { data: inbounds } = useInboundsQuery()
    const [selectedInbound, setSelectedInbound] = useState<string | undefined>(inbounds[0]?.id !== undefined ? String(inbounds[0].id) : undefined)
    const { data, isLoading } = useHostsQuery(Number(selectedInbound))
    const navigate = useNavigate({ from: "/hosts" })
    const [inboundSelectionAlert, setInboundSelectionAlert] = useDialog();

    const onEdit = (entity: HostType) => navigate({ to: "/hosts/$hostId/edit", params: { hostId: String(entity.id) } });
    const onDelete = (entity: HostType) => navigate({ to: "/hosts/$hostId/delete", params: { hostId: String(entity.id) } });
    const onOpen = (entity: HostType) => navigate({ to: "/hosts/$hostId", params: { hostId: String(entity.id) } });

    const onCreate = () => {
        if (selectedInbound) {
            navigate({
                to: "/hosts/$inboundId/create",
                params: {
                    inboundId: selectedInbound,
                }
            })
        } else {
            setInboundSelectionAlert(true)
        }
    };

    return (
        <div>
            <InboundNotSelectedAlertDialog
                open={inboundSelectionAlert}
                onOpenChange={setInboundSelectionAlert}
            />
            <InboundHostsDataTable
                data={data}
                inbounds={inbounds}
                selectedInbound={selectedInbound}
                columns={columns({ onDelete, onOpen, onEdit })}
                filteredColumn='remark'
                setSelectedInbound={setSelectedInbound}
                onCreate={onCreate}
                onOpen={onOpen}
                isLoading={isLoading}
            />
        </div>
    )
}
