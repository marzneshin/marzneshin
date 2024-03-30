
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

export const InboundHostsTable = () => {
    const { data: inbounds } = useInboundsQuery()
    const [selectedInbound, setSelectedInbound] = useState<string>(String(inbounds[0]?.id))
    const { data } = useHostsQuery(Number(selectedInbound))

    const [mutationDialogOpen, setMutationDialogOpen] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
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
        selectEntity(null);
        setMutationDialogOpen(true);
    };

    const onOpen = (entity: HostType) => {
        selectEntity(entity);
        setSettingsDialogOpen(true);
    };

    return (
        <div>
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
