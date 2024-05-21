
import {
    HostType,
    HostsDeleteConfirmationDialog,
    HostsMutationDialog,
    useHostsQuery
} from '@marzneshin/features/hosts'
import { InboundHostsDataTable } from './table'
import { useState } from 'react'
import { useInboundsQuery } from '@marzneshin/features/inbounds'
import { columns } from './columns'
import { HostSettingsDialog } from '../../dialogs/settings'
import { useDialog } from '@marzneshin/components'
import { InboundNotSelectedAlertDialog } from './inbound-not-selected-alert-dialog'

export const InboundHostsTable = () => {
    const { data: inbounds } = useInboundsQuery()
    const [selectedInbound, setSelectedInbound] = useState<string | undefined>(inbounds[0]?.id !== undefined ? String(inbounds[0].id) : undefined)
    const { data } = useHostsQuery(Number(selectedInbound))

    const [mutationDialogOpen, setMutationDialogOpen] = useDialog();
    const [deleteDialogOpen, setDeleteDialogOpen] = useDialog();
    const [settingsDialogOpen, setSettingsDialogOpen] = useDialog();
    const [inboundSelectionAlert, setInboundSelectionAlert] = useDialog();
    const [selectedEntity, selectEntity] = useState<HostType | null>(null);

    const onEdit = (entity: HostType) => {
        selectEntity(entity);
        setMutationDialogOpen(true);
    };

    const onDelete = (entity: HostType) => {
        selectEntity(entity);
        setDeleteDialogOpen(true);
    };

    const onCreate = () => {
        if (selectedInbound) {
            selectEntity(null);
            setMutationDialogOpen(true);
        } else {
            setInboundSelectionAlert(true)
        }
    };

    const onOpen = (entity: HostType) => {
        selectEntity(entity);
        setSettingsDialogOpen(true);
    };

    return (
        <div>
            <InboundNotSelectedAlertDialog
                open={inboundSelectionAlert}
                onOpenChange={setInboundSelectionAlert}
            />
            <HostSettingsDialog
                open={settingsDialogOpen}
                onOpenChange={setSettingsDialogOpen}
                entity={selectedEntity}
            />
            <HostsDeleteConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                entity={selectedEntity}
            />
            <HostsMutationDialog
                open={mutationDialogOpen}
                onOpenChange={setMutationDialogOpen}
                entity={selectedEntity}
                inboundId={Number(selectedInbound)}
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
            />
        </div>
    )
}
