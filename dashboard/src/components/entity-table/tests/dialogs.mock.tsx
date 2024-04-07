
import { Dialog, DialogContent, UseDialogProps } from '@marzneshin/components'
import { MockDataType } from './data.mock'

export const MockDialog = ({ open, onOpenChange, entity }: UseDialogProps<MockDataType>) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent data-testid={entity ? "edit-mutation-dialog" : "create-mutation-dialog"}>
                <span data-testid="name">{entity?.name}</span>
                <span data-testid="operating-system">{entity?.operatingSystem}</span>
                <span data-testid="proxy-protocol">{entity?.proxyProtocol}</span>
            </DialogContent>
        </Dialog>
    )
};


export const MockDeleteConfirmationDialog = ({ open, onOpenChange, entity }: UseDialogProps<MockDataType>) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent data-testid={entity ? "delete-confirmation-dialog" : null}>
                <span data-testid="name">{entity?.name}</span>
                <span data-testid="operating-system">{entity?.operatingSystem}</span>
                <span data-testid="proxy-protocol">{entity?.proxyProtocol}</span>
            </DialogContent>
        </Dialog>
    )
};


export const MockSettingsDialog = ({ open, onOpenChange, entity }: UseDialogProps<MockDataType>) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent data-testid="settings-dialog">
                <span data-testid="name">{entity?.name}</span>
                <span data-testid="operating-system">{entity?.operatingSystem}</span>
                <span data-testid="proxy-protocol">{entity?.proxyProtocol}</span>
            </DialogContent>
        </Dialog>
    )
};
