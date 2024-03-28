
import { DeleteConfirmation } from '@marzneshin/components'
import { FC } from 'react'
import { NodeType, useNodesDeletionMutation } from '@marzneshin/features/nodes'

interface NodesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: NodeType | null
}

export const NodesDeleteConfirmationDialog: FC<NodesDeleteConfirmationDialogProps> = ({ onOpenChange, open, entity }) => {
    const deleteMutation = useNodesDeletionMutation();
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
