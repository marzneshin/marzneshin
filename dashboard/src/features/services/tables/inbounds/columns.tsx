
import { ColumnDef } from "@tanstack/react-table"
import { InboundType } from "@marzneshin/features/inbounds"
import { DataTableColumnHeader } from "@marzneshin/components/data-table/column-header"
import i18n from "@marzneshin/features/i18n"
import { Badge, Checkbox } from "@marzneshin/components"

interface InboundsTableColumns {
    selectedInbound: number[]
    setSelectedInbound: (state: number[]) => void
}

export const columns = ({ selectedInbound, setSelectedInbound }: InboundsTableColumns): ColumnDef<InboundType>[] => ([
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => {
                    table.toggleAllPageRowsSelected(!!value)
                }}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={selectedInbound.includes(row.original.id)}
                onCheckedChange={(value) => {
                    setSelectedInbound([...selectedInbound, row.original.id])
                    row.toggleSelected(!!value)
                }}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "tag",
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('tag')} column={column} />,
    },
    {
        accessorKey: 'protocol',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('protocol')} column={column} />,
        cell: ({ row }) => (
            <Badge className="py-1 px-2"> {row.original.protocol} </Badge>
        )
    },
    {
        accessorKey: 'node',
        header: ({ column }) => <DataTableColumnHeader title={i18n.t('nodes')} column={column} />,
        cell: ({ row }) => (
            <Badge className="py-1 px-2"> {row.original.node.name} </Badge>
        )
    }
]);
