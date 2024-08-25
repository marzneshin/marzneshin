import type { ColumnDef } from "@tanstack/react-table";
import {
    type AdminType,
    AdminEnabledPill,
    AdminPermissionPill,
} from "@marzneshin/features/admins";
import {
    DataTableActionsCell,
    DataTableColumnHeader
} from "@marzneshin/features/entity-table"
import i18n from "@marzneshin/features/i18n";
import {
    NoPropogationButton,
} from "@marzneshin/components";
import {
    type ColumnActions
} from "@marzneshin/features/entity-table";

export const columns = (actions: ColumnActions<AdminType>): ColumnDef<AdminType>[] => [
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
        cell: ({ row }) => {
            return (
                <NoPropogationButton row={row} actions={actions}>
                    <DataTableActionsCell {...actions} row={row} />
                </NoPropogationButton>
            );
        },
    }
];
