import { ColumnDef } from "@tanstack/react-table";
import { ServiceType } from "@marzneshin/modules/services";
import {
    DataTableActionsCell,
    DataTableColumnHeader
} from "@marzneshin/libs/entity-table"
import i18n from "@marzneshin/features/i18n";
import {
    NoPropogationButton,
} from "@marzneshin/common/components";
import { ColumnActions } from "@marzneshin/libs/entity-table";

export const columns = (actions: ColumnActions<ServiceType>): ColumnDef<ServiceType>[] => ([
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('name')} column={column} />,
    },
    {
        accessorKey: "users",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('users')} column={column} />,
        cell: ({ row }) => `${row.original.user_ids.length}`
    },
    {
        accessorKey: "inbounds",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('inbounds')} column={column} />,
        cell: ({ row }) => `${row.original.inbound_ids.length}`
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
