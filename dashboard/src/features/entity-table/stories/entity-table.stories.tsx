import { EntityDataTable } from "../table";
import { DataTablePagination } from "../table-pagination";
import { TableFiltering } from "../table-filtering";
import { EntityTable } from "../entity-table";
import { Button } from "@marzneshin/components";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const TableFilteringComponent = TableFiltering as React.FC<unknown>
const DataTablePaginationComponent = DataTablePagination as React.FC<unknown>
const EntityDataTableComponent = EntityDataTable as React.FC<unknown>

const queryClient = new QueryClient();

const meta: Meta<typeof EntityTable> = {
    title: "Components/EntityTable",
    component: EntityTable,
    decorators: [(Story) => (
        <QueryClientProvider client={queryClient}>
            <Story />
        </QueryClientProvider>
    )],
    tags: ["autodocs"],
    subcomponents: {
        TableFilteringComponent,
        DataTablePaginationComponent,
        EntityDataTableComponent
    }
};

export default meta;

const fetchEntity = async ({ queryKey }: { queryKey: any }) => {
    const [entityKey, pageIndex, pageSize, columnFilters, sortColumn, sortOrder] = queryKey;
    return {
        entity: [
            { id: 1, name: "Entity 1", createdAt: "2023-01-01" },
            { id: 2, name: "Entity 2", createdAt: "2023-01-02" },
        ],
        pageCount: 1,
    };
};

const columnsFn = ({ onEdit, onDelete, onOpen }: any) => [
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
                <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>Delete</Button>
                <Button size="sm" onClick={() => onOpen(row.original)}>Open</Button>
            </div>
        ),
    },
];

type Story = StoryObj<typeof EntityTable>;

export const BasicEntityTable: Story = {
    args: {
        fetchEntity: fetchEntity,
        columnsFn: columnsFn,
        filteredColumn: "name",
        entityKey: "entities",
        onCreate: () => alert("Create entity"),
        onEdit: (entity: any) => alert(`Edit entity: ${JSON.stringify(entity)}`),
        onOpen: (entity: any) => alert(`Open entity: ${JSON.stringify(entity)}`),
        onDelete: (entity: any) => alert(`Delete entity: ${JSON.stringify(entity)}`),
    }
}


export const SidebarEntityTable: Story = {
    args: {
        fetchEntity: fetchEntity,
        columnsFn: columnsFn,
        filteredColumn: "name",
        entityKey: "entities",
        onCreate: () => alert("Create entity"),
        onEdit: (entity: any) => alert(`Edit entity: ${JSON.stringify(entity)}`),
        onOpen: (entity: any) => alert(`Open entity: ${JSON.stringify(entity)}`),
        onDelete: (entity: any) => alert(`Delete entity: ${JSON.stringify(entity)}`),
    }
}
