import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@marzneshin/components";
import { FC, useCallback, useState } from 'react';
import {
    useUserUsageResetCmd,
    UserType,
    UsersStatus,
    UsersStatusBadge,
    useUserStatusEnable
} from '@marzneshin/features/users';
import { CircularProgress } from "@nextui-org/progress";
import { useTranslation } from "react-i18next";
import { format, isDate, isValid } from "date-fns";
import { cn } from "@marzneshin/utils";
import { LoaderIcon } from "lucide-react";

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
    const { mutate: resetUsage, isPending } = useUserUsageResetCmd()
    const { mutate: userStatusEnable } = useUserStatusEnable()
    const expireDate = entity.expire ? (isDate(entity.expire) ? entity.expire : new Date(entity.expire)) : null;
    const [userStatus, setUserStatus] = useState<boolean>(entity.enabled)

    const handleUserStatusEnabledToggle = useCallback(() => {
        userStatusEnable({ user: entity, enabled: !userStatus })
        setUserStatus(!userStatus)
    }, [entity, userStatus, userStatusEnable]);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle>{t('user_info')}</CardTitle>
                <div className="flex flex-row justify-center items-center gap-3">
                    <Button onClick={() => resetUsage(entity)}>
                        {t('page.users.reset_usage')}
                    </Button>
                    <Button
                        className={cn(userStatus ? 'bg-red-400' : 'bg-green-400', { 'bg-muted-foreground': isPending })}
                        onClick={handleUserStatusEnabledToggle}
                    >
                        {isPending ? <LoaderIcon className="animate-spin" /> : t(!userStatus ? 'enable' : 'disable')}
                    </Button>
                </div>
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
