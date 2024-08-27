import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@marzneshin/features/entity-table"
import i18n from "@marzneshin/features/i18n"
import {
    UserType,
    UserActivatedPill,
    UserEnabledPill,
    UserExpirationValue,
    userTrafficSortingFn,
} from "@marzneshin/features/users"
import { CircularProgress } from "@nextui-org/progress";
import { Badge } from "@marzneshin/components";

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('username')} column={column} />,
    },
    {
        accessorKey: "activated",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("activated")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserActivatedPill user={row.original} />,
    },
    {
        accessorKey: "enabled",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("enabled")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserEnabledPill user={row.original} />,
    },
    {
        accessorKey: "used_traffic",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('page.users.used_traffic')} column={column} />,
        cell: ({ row }) => {
            if (row.original.data_limit) {
                return (
                    <CircularProgress
                        size="sm"
                        value={row.original.used_traffic / row.original.data_limit * 100}
                    />
                )
            } else {
                return <Badge>No Limit</Badge>
            }
        },
        sortingFn: (rowA, rowB) => userTrafficSortingFn(rowA.original, rowB.original)
    },
    {
        accessorKey: "expire",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_date")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserExpirationValue user={row.original} />,
    },
];
