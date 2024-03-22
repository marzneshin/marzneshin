import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Table
} from "@marzneshin/components"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import { NodeType } from ".."

interface NodesDeleteConfirmationDialogProps {
    onOpenChange: (state: boolean) => void
    open: boolean
    node: NodeType | null
}

export const NodesSettingsConfirmationDialog: FC<NodesDeleteConfirmationDialogProps> = ({ onOpenChange, open }) => {
    const { t } = useTranslation();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:w-full w-[100px]" >
                <SheetHeader>
                    <SheetTitle>
                        {t('page.nodes.settings.title')}
                    </SheetTitle>
                </SheetHeader>

                <Table>

                </Table>
            </SheetContent>
        </Sheet>
    )
}
