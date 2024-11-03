import { type FC } from "react";
import {
    SettingsDialogProps,
    SettingsDialog,
    Table,
    TableBody,
    TableRowWithCell,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";

interface HostWithProfileSchemaType {
    remark: string;
    address: string;
    weight?: number | null;
    port?: string | number | null;
    host?: string;
    path?: string;
    sni?: string;
    alpn?: string;
}

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
                    <TableRowWithCell
                        label={t("port")}
                        value={entity.port?.toString() ?? ""}
                    />
                    <TableRowWithCell
                        label={t("host")}
                        value={entity.host ?? ""}
                    />
                    <TableRowWithCell
                        label={t("path")}
                        value={entity.path ?? ""}
                    />
                    <TableRowWithCell
                        label={t("sni")}
                        value={entity.sni ?? ""}
                    />
                    <TableRowWithCell
                        label={t("alpn")}
                        value={entity.alpn ?? ""}
                    />
                </TableBody>
            </Table>
        </SettingsDialog>
    );
};
