
import { ColumnDef } from "@tanstack/react-table"
import { UsersStatusBadge, UserType, UsersStatus } from "@marzneshin/features/users"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { CopyToClipboardButton, DataTableActionsCell, buttonVariants } from "@marzneshin/components"
import { CircularProgress } from "@nextui-org/progress"
import { LinkIcon } from "lucide-react"
import { getSubscriptionLink } from "@marzneshin/utils"


interface ColumnAction {
    onDelete: (user: UserType) => void;
    onOpen: (user: UserType) => void;
    onEdit: (user: UserType) => void;
}

export const columns = (actions: ColumnAction): ColumnDef<UserType>[] => ([
    {
        accessorKey: "username",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('username')} column={column} />,
        cell: ({ row }) => (<div className="flex flex-row gap-2 items-center">
            <OnlineStatus user={row.original} /> {row.original.username}
        </div>)
    },
    {
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('status')} column={column} />,
        cell: ({ row }) => <UsersStatusBadge status={UsersStatus[row.original.status]} />,
    },
    {
        accessorKey: "services",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('services')} column={column} />,
        cell: ({ row }) => row.original.services.length
    },
    {
        accessorKey: "used_traffic",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('page.users.used_traffic')} column={column} />,
        cell: ({ row }) => {
            if (row.original.data_limit)
                return (
                    <CircularProgress
                        value={row.original.used_traffic / row.original.data_limit * 100}
                        size='sm'
                        showValueLabel
                    />
                )
            else
                return "No Traffic"
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <div className="flex flex-row gap-2 items-center" onClick={(e) => e.stopPropagation()}>
            <CopyToClipboardButton
                text={getSubscriptionLink(row.original.subscription_url)}
                successMessage={i18n.t('page.users.settings.subscription_link.copied')}
                copyIcon={LinkIcon}
                className={buttonVariants({ variant: "ghost", className: "h-8 w-8" })}
                tooltipMsg={i18n.t('page.users.settings.subscription_link.copy')}
            />
            <DataTableActionsCell {...actions} row={row} />
        </div>
    },
]);
