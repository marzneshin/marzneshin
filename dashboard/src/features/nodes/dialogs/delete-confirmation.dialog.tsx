
import { DeleteConfirmation } from '@marzneshin/components'
import { FC } from 'react'
import { NodeType, useNodesDeletionMutation } from '@marzneshin/features/nodes'

interface NodesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    node: NodeType | null
}

export const NodesDeleteConfirmationDialog: FC<NodesDeleteConfirmationDialogProps> = ({ onOpenChange, open, node }) => {
    const deleteMutation = useNodesDeletionMutation();
    if (node !== null) {
        return (
            <DeleteConfirmation
                open={open}
                onOpenChange={onOpenChange}
                action={() => deleteMutation.mutate(node)}
            />
        )
    }
}
