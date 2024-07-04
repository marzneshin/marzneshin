import { type FC, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Table,
    TableBody,
    TableRowWithCell,
} from "@marzneshin/components"
import { useTranslation } from "react-i18next"
import { HostType } from "../.."

interface HostsSettingsDialogProps {
    onOpenChange: (state: boolean) => void
    onClose: () => void
    open: boolean
    entity: HostType
}

export const HostSettingsDialog: FC<HostsSettingsDialogProps> = ({ onOpenChange, open, entity, onClose }) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:min-w-full md:min-w-[700px]" >
                <SheetHeader>
                    <SheetTitle>
                        {t('page.hosts.settings.title')}
                    </SheetTitle>
                </SheetHeader>
                <Table>
                    <TableBody>
                        <TableRowWithCell label={t('remark')} value={entity.remark} />
                        <TableRowWithCell label={t('address')} value={entity.address} />
                        <TableRowWithCell label={t('port')} value={entity.port} />
                        <TableRowWithCell label={t('host')} value={entity.host} />
                        <TableRowWithCell label={t('path')} value={entity.path} />
                        <TableRowWithCell label={t('sni')} value={entity.sni} />
                        <TableRowWithCell label={t('alpn')} value={entity.alpn} />
                    </TableBody>
                </Table>
            </SheetContent>
        </Sheet>
    )
}
