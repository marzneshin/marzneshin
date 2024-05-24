import type { ColumnDef } from "@tanstack/react-table";
import type { UserType } from "@marzneshin/features/users";
import {
    UsersStatusBadge,
    UsersStatus,
    OnlineStatus,
    UserUsedTraffic,
} from "@marzneshin/features/users";
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header";
import i18n from "@marzneshin/features/i18n";
import {
    CopyToClipboardButton,
    DataTableActionsCell,
    buttonVariants,
} from "@marzneshin/components";
import { LinkIcon } from "lucide-react";
import { getSubscriptionLink } from "@marzneshin/utils";
import { format } from "date-fns";

interface ColumnAction {
    onDelete: (user: UserType) => void;
    onOpen: (user: UserType) => void;
    onEdit: (user: UserType) => void;
}

export const columns = (actions: ColumnAction): ColumnDef<UserType>[] => [
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader title={i18n.t("username")} column={column} />
        ),
        cell: ({ row }) => (
            <div className="flex flex-row gap-2 items-center">
                <OnlineStatus user={row.original} /> {row.original.username}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader title={i18n.t("status")} column={column} />
        ),
        cell: ({ row }) => (
            <UsersStatusBadge status={UsersStatus[row.original.status]} />
        ),
        enableSorting: false,
    },
    {
        accessorKey: "used_traffic",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.used_traffic")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserUsedTraffic user={row.original} />,
    },
    {
        accessorKey: "expire",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_date")}
                column={column}
            />
        ),
        cell: ({ row }) =>
            row.original.expire
                ? format(row.original.expire.toLocaleString(), "PPP")
                : "Unlimited",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div
                    className="flex flex-row gap-2 items-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CopyToClipboardButton
                        text={getSubscriptionLink(row.original.subscription_url)}
                        successMessage={i18n.t(
                            "page.users.settings.subscription_link.copied",
                        )}
                        copyIcon={LinkIcon}
                        className={buttonVariants({
                            variant: "secondary",
                            className: "size-8",
                        })}
                        tooltipMsg={i18n.t("page.users.settings.subscription_link.copy")}
                    />
                    <DataTableActionsCell {...actions} row={row} />
                </div>
            );
        },
    },
];
