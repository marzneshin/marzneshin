import { Button } from "@marzneshin/common/components";

export const columnsFnBasicEntityTable = ({ onEdit, onDelete, onOpen }: any) => [
    {
        header: "ID",
        accessorKey: "id",
    },
    {
        header: "Name",
        accessorKey: "name",
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
    },
    {
        header: "Actions",
        cell: ({ row }: any) => (
            <div className="flex items-center gap-2 flex-row">
                <Button size="sm" onClick={() => onEdit(row.original)}>Edit</Button>
                <Button size="sm" variant="secondary" onClick={() => onOpen(row.original)}>Open</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>Delete</Button>
            </div>
        ),
    },
];
