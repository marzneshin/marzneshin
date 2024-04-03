
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@marzneshin/components"
import { FC } from 'react'
import { UserType, UsersStatus, UsersStatusBadge } from '@marzneshin/features/users';
import { CircularProgress } from "@nextui-org/progress";
import { useTranslation } from "react-i18next";

interface UserInfoTableProps {
    entity: UserType
}

export const UserInfoTable: FC<UserInfoTableProps> = (
    { entity }
) => {
    const { t } = useTranslation()
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {t('user_info')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>
                                {t('username')}
                            </TableHead>
                            <TableCell>
                                {entity.username}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('status')}
                            </TableHead>
                            <TableCell>
                                <UsersStatusBadge status={UsersStatus[entity.status]} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('page.users.expire_date')}
                            </TableHead>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                        {entity.data_limit &&
                            <TableRow>
                                <TableHead>
                                    {t('page.users.used_traffic')}
                                </TableHead>
                                <TableCell>
                                    <CircularProgress size="sm" value={entity.used_traffic / entity.data_limit * 100} />
                                </TableCell>
                            </TableRow>
                        }
                        <TableRow>
                            <TableHead>
                                {t('subscription_link')}
                            </TableHead>
                            <TableCell>
                                {entity.username}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                {t('note')}
                            </TableHead>
                            <TableCell>
                                {entity.note}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
