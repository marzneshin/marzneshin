
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import { DataTableActionsCell } from "@marzneshin/components"
import { MockDataType } from "./data.mock";

interface ColumnAction {
    onDelete: (host: MockDataType) => void;
    onOpen: (host: MockDataType) => void;
    onEdit: (host: MockDataType) => void;
}

export const mockColumns = (actions: ColumnAction): ColumnDef<MockDataType>[] => ([
    {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader title="Name" column={column} />,
    },
    {
        accessorKey: "operatingSystem",
        header: ({ column }) => <DataTableColumnHeader title="Operating System" column={column} />,
    },
    {
        accessorKey: "proxyProtocol",
        header: ({ column }) => <DataTableColumnHeader title="Proxy Protocol" column={column} />,
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableActionsCell {...actions} row={row} />
    },
]);
