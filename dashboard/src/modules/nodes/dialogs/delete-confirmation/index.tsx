
import { DeleteConfirmation } from '@marzneshin/common/components'
import { FC, useEffect } from 'react'
import { NodeType, useNodesDeletionMutation } from '@marzneshin/modules/nodes'

interface NodesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: NodeType
    onClose: () => void
}

export const NodesDeleteConfirmationDialog: FC<NodesDeleteConfirmationDialogProps> = (
    { onOpenChange, open, entity, onClose }
) => {
    const deleteMutation = useNodesDeletionMutation();

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
