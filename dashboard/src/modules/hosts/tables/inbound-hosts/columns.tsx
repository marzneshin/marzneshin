import { ColumnDef } from "@tanstack/react-table"
import { HostType } from "@marzneshin/modules/hosts"
import {
    DataTableActionsCell,
    DataTableColumnHeader
} from "@marzneshin/libs/entity-table"
import i18n from "@marzneshin/features/i18n"
import {
    type ColumnActions
} from "@marzneshin/libs/entity-table";
import {
    NoPropogationButton,
} from "@marzneshin/common/components"

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
