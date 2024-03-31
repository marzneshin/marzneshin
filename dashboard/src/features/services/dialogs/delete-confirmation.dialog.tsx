
import { DeleteConfirmation } from '@marzneshin/components'
import { FC } from 'react'
import { ServiceType, useServicesDeletionMutation } from '@marzneshin/features/services'

interface ServicesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: ServiceType | null
}

export const ServicesDeleteConfirmationDialog: FC<ServicesDeleteConfirmationDialogProps> = ({ onOpenChange, open, entity }) => {
    const deleteMutation = useServicesDeletionMutation();
    if (entity !== null) {
        return (
            <DeleteConfirmation
                open={open}
                onOpenChange={onOpenChange}
                action={() => deleteMutation.mutate(entity)}
            />
        )
    } else {
        return null
    }
}
