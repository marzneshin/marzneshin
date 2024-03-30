import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { UserType/* , UserStatusBadge, statusColors */ } from "@marzneshin/features/users"
import { CircularProgress } from "@nextui-org/progress";
import { format } from "date-fns";
import { Badge } from "@marzneshin/components";

export const columns: ColumnDef<UserType>[] = [
    {
        accessorKey: "username",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('username')} column={column} />,
    },
    // {
    //     accessorKey: 'status',
    //     header: ({ column }) => <DataTableColumnHeader title={i18n.t('status')} column={column} />,
    //     cell: ({ row }) => <UserStatusBadge status={statusColors[row.original.status ? row.original.status : 'error']} />,
    // },
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
        sortingFn: (rowA, rowB) => {
            if (rowA.original.data_limit && rowB.original.data_limit) {
                const rowAUsedTraffic = (rowA.original.used_traffic / rowA.original.data_limit) * 100
                const rowBUsedTraffic = (rowA.original.used_traffic / rowA.original.data_limit) * 100
                return rowAUsedTraffic > rowBUsedTraffic ? 1 : rowBUsedTraffic > rowAUsedTraffic ? -1 : 0
            } else {
                return 0
            }
        }
    },
    {
        accessorKey: 'expire',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('expire')} column={column} />,
        cell: ({ row }) => format(row.original.expire, "PP")
    }
];
