import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableRowWithCell,
    DateTableRow,
    CircularProgressBarRow
} from "@marzneshin/components";
import { FC } from "react";
import {
    type UserProp,
    UserEnabledPill,
    UserActivatedPill,
    UserDataLimitReachedPill,
} from "@marzneshin/features/users";
import { useTranslation } from "react-i18next";

export const UserInfoTable: FC<UserProp> = ({ user: entity }) => {
    const { t } = useTranslation();
    const expireDate = entity.expire_date
        ? new Date(entity.expire_date)
        : null;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle>{t("user_info")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRowWithCell label={t("username")} value={entity.username} />
                        <TableRowWithCell
                            label={t("enabled")}
                            value={<UserEnabledPill user={entity} />}
                        />
                        <TableRowWithCell
                            label={t("activated")}
                            value={<UserActivatedPill user={entity} />}
                        />
                        {{
                            fixed_date: (
                                <DateTableRow
                                    label={t("page.users.expire_date")}
                                    date={expireDate}
                                />
                            ),
                            start_on_first_use: (
                                <>
                                    <TableRowWithCell
                                        label={t("page.users.usage_duration")}
                                        value={(entity.usage_duration ? entity.usage_duration : 0) / 86400}
                                    />
                                    <DateTableRow
                                        label={t("page.users.activation_deadline")}
                                        date={entity.activation_deadline}
                                    />
                                </>
                            ),
                            never: (
                                <TableRowWithCell
                                    label={t("page.users.expire_method")}
                                    value={t('never')}
                                />
                            )
                        }[entity.expire_strategy]}

                        <CircularProgressBarRow
                            label={t("page.users.used_traffic")}
                            value={entity.used_traffic}
                            limit={entity.data_limit}
                        />

                        <TableRowWithCell
                            label={t("page.users.data_limit_reached")}
                            value={<UserDataLimitReachedPill user={entity} />}
                        />
                        <DateTableRow
                            label={t("page.users.online_at")}
                            date={entity.online_at}
                        />
                        <TableRowWithCell label={t("note")} value={entity.note} />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
