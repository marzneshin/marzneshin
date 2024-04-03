
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
import { UserType, UsersStatus, UsersStatusBadge } from '../../..';
import { CircularProgress } from "@nextui-org/progress";

interface UserInfoTableProps {
    entity: UserType
}

export const UserInfoTable: FC<UserInfoTableProps> = (
    { entity }
) => {

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Users Info
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableHead>
                                Username
                            </TableHead>
                            <TableCell>
                                {entity.username}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableCell>
                                <UsersStatusBadge status={UsersStatus[entity.status]} />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                Expire Date
                            </TableHead>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                        {entity.data_limit &&
                            <TableRow>
                                <TableHead>
                                    Used Traffic
                                </TableHead>
                                <TableCell>
                                    <CircularProgress size="sm" value={entity.used_traffic / entity.data_limit * 100} />
                                </TableCell>
                            </TableRow>
                        }
                        <TableRow>
                            <TableHead>
                                Subscription link
                            </TableHead>
                            <TableCell>
                                {entity.username}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableHead>
                                Note
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
