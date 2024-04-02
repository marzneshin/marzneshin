
import { DeleteConfirmation } from '@marzneshin/components'
import { FC } from 'react'
import { UserMutationType, useUsersDeletionMutation } from '@marzneshin/features/users'

interface UsersDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    entity: UserMutationType | null
}

export const UsersDeleteConfirmationDialog: FC<UsersDeleteConfirmationDialogProps> = ({ onOpenChange, open, entity }) => {
    const deleteMutation = useUsersDeletionMutation();
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
