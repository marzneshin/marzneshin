import { type FC } from "react";
import {
    SettingsDialogProps,
    SettingsDialog,
    Table,
    TableBody,
    TableRowWithCell,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import {
    type HostWithProfileSchemaType
} from "@marzneshin/modules/hosts";

interface HostsSettingsDialogProps extends SettingsDialogProps {
    onOpenChange: (state: boolean) => void;
    onClose: () => void;
    open: boolean;
    entity: HostWithProfileSchemaType;
}

export const HostSettingsDialog: FC<HostsSettingsDialogProps> = ({
    onOpenChange,
    open,
    entity,
    onClose,
}) => {
    const { t } = useTranslation();

    return (
        <SettingsDialog open={open} onClose={onClose} onOpenChange={onOpenChange}>
            <Table>
                <TableBody>
                    <TableRowWithCell label={t("remark")} value={entity.remark} />
                    <TableRowWithCell label={t("address")} value={entity.address} />
                    <TableRowWithCell label={t("port")} value={entity.port} />
                    <TableRowWithCell label={t("host")} value={entity.host ?? ""} />
                    <TableRowWithCell label={t("path")} value={entity.path ?? ""} />
                    <TableRowWithCell label={t("sni")} value={entity.sni ?? ""} />
                    <TableRowWithCell label={t("alpn")} value={entity.alpn ?? ""} />
                </TableBody>
            </Table>
        </SettingsDialog>
    );
};
