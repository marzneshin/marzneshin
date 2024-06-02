import { ColumnDef } from "@tanstack/react-table"
import { HostType } from "@marzneshin/features/hosts"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { DataTableActionsCell } from "@marzneshin/components"

interface ColumnAction {
    onDelete: (host: HostType) => void;
    onOpen: (host: HostType) => void;
    onEdit: (host: HostType) => void;
}


export const columns = (actions: ColumnAction): ColumnDef<HostType>[] => ([
    {
        accessorKey: "remark",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('name')} column={column} />,
    },
    {
        accessorKey: "address",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('address')} column={column} />,
    },
    {
        accessorKey: "port",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('port')} column={column} />,
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableActionsCell {...actions} row={row} />
    },
]);
