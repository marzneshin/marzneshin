import { type FC, useEffect } from "react";
import {
    SettingsDialogProps,
    SettingsDialog,
    Table,
    TableBody,
    TableRowWithCell,
} from "@marzneshin/components"
import { useTranslation } from "react-i18next"
import { HostType } from "../.."

interface HostsSettingsDialogProps extends SettingsDialogProps {
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
        <SettingsDialog open={open} onOpenChange={onOpenChange}>
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
        </SettingsDialog>
    )
}
