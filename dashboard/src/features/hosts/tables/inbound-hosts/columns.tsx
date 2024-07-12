import { ColumnDef } from "@tanstack/react-table"
import { HostType } from "@marzneshin/features/hosts"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import {
    type ColumnActions
} from "@marzneshin/features/entity-table";
import {
    DataTableActionsCell,
    NoPropogationButton,
} from "@marzneshin/components"

export const columns = (actions: ColumnActions<HostType>): ColumnDef<HostType>[] => ([
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
        cell: ({ row }) => {
            return (
                <NoPropogationButton row={row} actions={actions}>
                    <DataTableActionsCell {...actions} row={row} />
                </NoPropogationButton>
            );
        },
    }
]);
