import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableRowWithCell,
} from "@marzneshin/components";
import { FC } from "react";
import {
    type AdminProp,
    AdminEnabledPill,
    AdminPermissionPill
} from "@marzneshin/features/admins";
import { useTranslation } from "react-i18next";
import { format } from '@chbphone55/pretty-bytes';

export const AdminInfoTable: FC<AdminProp> = ({ admin: entity }) => {
    const { t } = useTranslation();
    const usersDataUsage = format(entity.users_data_usage);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle>{t("admin_info")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRowWithCell label={t("username")} value={entity.username} />
                        <TableRowWithCell
                            label={t("enabled")}
                            value={<AdminEnabledPill admin={entity} />}
                        />
                        <TableRowWithCell
                            label={t("page.admins.users-data-usage")}
                            value={`${usersDataUsage[0]} ${usersDataUsage[1]}`}
                        />
                        <TableRowWithCell
                            label={t("page.admins.permission")}
                            value={<AdminPermissionPill admin={entity} />}
                        />

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
