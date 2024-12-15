
import { DeleteConfirmation } from '@marzneshin/common/components'
import { type FC, useEffect } from 'react'
import { ServiceType, useServicesDeletionMutation } from '@marzneshin/modules/services'

interface ServicesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: ServiceType
    onClose: () => void;
}

export const ServicesDeleteConfirmationDialog: FC<ServicesDeleteConfirmationDialogProps> = ({ onOpenChange, open, entity, onClose }) => {
    const deleteMutation = useServicesDeletionMutation();
    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);
    return (
        <DeleteConfirmation
            open={open}
            onOpenChange={onOpenChange}
            action={() => deleteMutation.mutate(entity)}
        />
    )
}
