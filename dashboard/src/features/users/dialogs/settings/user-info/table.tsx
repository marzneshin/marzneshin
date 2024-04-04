import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableRow } from "@marzneshin/components";
import { FC } from 'react';
import { UserType, UsersStatus, UsersStatusBadge } from '@marzneshin/features/users';
import { CircularProgress } from "@nextui-org/progress";
import { useTranslation } from "react-i18next";
import { format, isDate, isValid } from "date-fns";

interface UserInfoTableProps {
    entity: UserType;
}

const TableRowWithCell: FC<{ label: string; value: string | number | JSX.Element }> = ({ label, value }) => (
    <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell>{value}</TableCell>
    </TableRow>
);

const DateTableRow: FC<{ label: string; date: Date | string }> = ({ label, date }) => {
    let formattedDate = '';
    if (date && isValid(date)) {
        formattedDate = format(date, "PPP");
    }
    return (
        <TableRowWithCell label={label} value={formattedDate} />
    );
};

const CircularProgressBarRow: FC<{ label: string; value: number; limit: number }> = ({ label, value, limit }) => (
    <TableRow>
        <TableCell>{label}</TableCell>
        <TableCell><CircularProgress size="sm" value={value / limit * 100} /></TableCell>
    </TableRow>
);

export const UserInfoTable: FC<UserInfoTableProps> = ({ entity }) => {
    const { t } = useTranslation();

    const expireDate = entity.expire ? (isDate(entity.expire) ? entity.expire : new Date(entity.expire)) : null;
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('user_info')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRowWithCell label={t('username')} value={entity.username} />
                        <TableRowWithCell label={t('status')} value={<UsersStatusBadge status={UsersStatus[entity.status]} />} />
                        {(expireDate && entity.on_hold_expire_duration === 0) ? (
                            <DateTableRow label={t('page.users.expire_date')} date={expireDate} />
                        ) : (
                            <>
                                <TableRowWithCell label={t('page.users.on_hold_expire_duration')} value={entity.on_hold_expire_duration} />
                                {entity.on_hold_timeout &&
                                    <DateTableRow label={t('page.users.expire_date')} date={entity.on_hold_timeout} />
                                }
                            </>
                        )}
                        {entity.data_limit &&
                            <CircularProgressBarRow label={t('page.users.used_traffic')} value={entity.used_traffic} limit={entity.data_limit} />
                        }
                        <DateTableRow label={t('page.users.online_at')} date={entity.online_at} />
                        <TableRowWithCell label={t('note')} value={entity.note} />
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
