
import { ColumnDef } from "@tanstack/react-table"
import { UsersStatusBadge, UserType, UsersStatus } from "@marzneshin/features/users"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { DataTableActionsCell } from "@marzneshin/components"
import { CircularProgress } from "@nextui-org/progress"

interface ColumnAction {
    onDelete: (user: UserType) => void;
    onOpen: (user: UserType) => void;
    onEdit: (user: UserType) => void;
}


export const columns = (actions: ColumnAction): ColumnDef<UserType>[] => ([
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('name')} column={column} />,
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('status')} column={column} />,
        cell: ({ row }) => <UsersStatusBadge status={UsersStatus[row.original.status]} />,
    },
    {
        accessorKey: "services",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('services')} column={column} />,
        cell: ({ row }) => row.original.services.length
    },
    {
        accessorKey: "used_traffic",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('page.users.usage_coefficient')} column={column} />,
        cell: ({ row }) => {
            if (row.original.data_limit)
                return (
                    <CircularProgress
                        value={row.original.used_traffic / row.original.data_limit * 100}
                        size='sm'
                        showValueLabel
                    />
                )
            else
                return "No Traffic"
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableActionsCell {...actions} row={row} />
    },
]);
