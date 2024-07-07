import type { ColumnDef } from "@tanstack/react-table";
import {
    type UserType,
    OnlineStatus,
    UserUsedTraffic,
    UserActivatedPill,
    UserEnabledPill,
    UserExpireStrategyPill,
    UserExpirationValue
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
        accessorKey: "activated",
        enableSorting: false,
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("activated")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserActivatedPill user={row.original} />,
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
        accessorKey: "expire_strategy",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_method")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserExpireStrategyPill user={row.original} />,
        enableSorting: false,
    },
    {
        accessorKey: "expire_date",
        header: ({ column }) => (
            <DataTableColumnHeader
                title={i18n.t("page.users.expire_date")}
                column={column}
            />
        ),
        cell: ({ row }) => <UserExpirationValue user={row.original} />,
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
