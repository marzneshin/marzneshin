import type { ColumnDef } from "@tanstack/react-table";
import {
    type AdminType,
    AdminEnabledPill,
    AdminPermissionPill,
} from "@marzneshin/features/admins";
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header";
import i18n from "@marzneshin/features/i18n";
import {
    DataTableActionsCell,
} from "@marzneshin/components";

interface ColumnAction {
    onDelete: (admin: AdminType) => void;
    onOpen: (admin: AdminType) => void;
    onEdit: (admin: AdminType) => void;
}

export const columns = (actions: ColumnAction): ColumnDef<AdminType>[] => [
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
            const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    actions.onOpen(row.original);
                }
            };

            return (
                <div
                    className="flex flex-row gap-2 items-center"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="button"
                >
                    <DataTableActionsCell {...actions} row={row} />
                </div>
            );
        },
    }
];
