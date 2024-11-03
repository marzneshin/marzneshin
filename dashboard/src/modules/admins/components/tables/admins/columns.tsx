import type { ColumnDef } from "@tanstack/react-table";
import {
    type AdminType,
    AdminEnabledPill,
    AdminPermissionPill,
} from "@marzneshin/modules/admins";
import {
    DataTableActionsCell,
    DataTableColumnHeader
} from "@marzneshin/libs/entity-table"
import i18n from "@marzneshin/features/i18n";
import {
    NoPropogationButton,
} from "@marzneshin/common/components";
import {
    type ColumnActions
} from "@marzneshin/libs/entity-table";

export const columns = (actions: ColumnActions<AdminType>): ColumnDef<AdminType, any>[] => [
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader title={i18n.t("username")} column={column} />
        ),
    },
    {
        accessorKey: "enabled",
        enableSorting: false,
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("enabled")}
                column={column}
            />
        ),
        cell: ({ row }) => <AdminEnabledPill admin={row.original} />,
    },
    {
        accessorKey: "is_sudo",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.admins.permission")}
                column={column}
            />
        ),
        cell: ({ row }) => <AdminPermissionPill admin={row.original} />,
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <NoPropogationButton row={row} actions={actions}>
                <DataTableActionsCell {...actions} row={row} />
            </NoPropogationButton>
        ),
    }
];
