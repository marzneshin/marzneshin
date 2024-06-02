import { type FC, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
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
                        <TableRow>
                            <TableHead>
                                {t('remark')}
                            </TableHead>
                            <TableCell>
                                {entity.remark}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('address')}
                            </TableHead>
                            <TableCell>
                                {entity.address}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('port')}
                            </TableHead>
                            <TableCell>
                                {entity.port}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('host')}
                            </TableHead>
                            <TableCell>
                                {entity.host}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('path')}
                            </TableHead>
                            <TableCell>
                                {entity.path}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('sni')}
                            </TableHead>
                            <TableCell>
                                {entity.sni}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('alpn')}
                            </TableHead>
                            <TableCell>
                                {entity.alpn}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </SheetContent>
        </Sheet>
    )
}
