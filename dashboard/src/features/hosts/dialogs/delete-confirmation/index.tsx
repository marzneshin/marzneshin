import { DeleteConfirmation } from '@marzneshin/components'
import { FC } from 'react'
import { HostType, useHostsDeletionMutation } from '@marzneshin/features/hosts'

interface HostsDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: HostType | null
}

export const HostsDeleteConfirmationDialog: FC<HostsDeleteConfirmationDialogProps> = ({ onOpenChange, open, entity }) => {
    const deleteMutation = useHostsDeletionMutation();
    if (entity !== null) {
        return (
            <DeleteConfirmation
                open={open}
                onOpenChange={onOpenChange}
                action={() => deleteMutation.mutate(entity)}
            />
        )
    }
}
