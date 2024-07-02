import type { ColumnDef } from "@tanstack/react-table";
import {
    type UserType,
    OnlineStatus,
    UserUsedTraffic,
} from "@marzneshin/features/users";
import { Badge } from "@marzneshin/components";
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
        accessorKey: "activated",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("activated")}
                column={column}
            />
        ),
        cell: ({ row }) => row.original.activated ? <Badge variant="positive">{i18n.t("active")}</Badge> : <Badge variant="destructive">{i18n.t("inactive")}</Badge>,
    },
    {
        accessorKey: "enabled",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("enabled")}
                column={column}
            />
        ),
        cell: ({ row }) => row.original.enabled ? <Badge variant="positive">{i18n.t("enabled")}</Badge> : <Badge variant="destructive">{i18n.t("disabled")}</Badge>,
    },
    {
        accessorKey: "expire_strategy",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_method")}
                column={column}
            />
        ),
        cell: ({ row }) => (
            <Badge>{{
                start_on_first_use: i18n.t("page.users.on_first_use"),
                fixed_date: i18n.t("page.users.fixed_date"),
                never: i18n.t("page.users.never"),
            }[row.original.expire_strategy]}</Badge>
        )
    },
    {
        accessorKey: "expire",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_date")}
                column={column}
            />
        ),
        cell: ({ row }) => (
            {
                start_on_first_use: row.original.usage_duration && `${(row.original.usage_duration / 86400)} Day`,
                fixed_date: row.original.expire_date && format(row.original.expire_date?.toLocaleString(), "PPP"),
                never: "Never",
            }[row.original.expire_strategy]
        )
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
    }
];
