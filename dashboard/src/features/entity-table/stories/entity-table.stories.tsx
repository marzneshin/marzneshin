import {
    EntityDataTable,
    DataTablePagination,
    TableFiltering,
} from "../components";
import { EntityTable } from "../entity-table";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { columnsFnBasicEntityTable } from "./columns-fns";
import { fetchEntity, fetchEntityLoading } from "./fetch-entities";

const TableFilteringComponent = TableFiltering as React.FC<unknown>;
const DataTablePaginationComponent = DataTablePagination as React.FC<unknown>;
const EntityDataTableComponent = EntityDataTable as React.FC<unknown>;

const queryClient = new QueryClient();

const meta: Meta<typeof EntityTable> = {
    title: "Features/Entity Table/Entity Table",
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


type Story = StoryObj<typeof EntityTable>;

const onEdit = (entity: any) => alert(`Edit entity: ${JSON.stringify(entity)}`)
const onDelete = (entity: any) => alert(`Delete entity: ${JSON.stringify(entity)}`)
const onOpen = (entity: any) => alert(`Open entity: ${JSON.stringify(entity)}`)

export const BasicEntityTable: Story = {
    args: {
        fetchEntity: fetchEntity,
        columns: columnsFnBasicEntityTable({ onEdit, onDelete, onOpen }),
        filteredColumn: "name",
        entityKey: "entities",
        onCreate: () => alert("Create entity"),
        onOpen: onOpen,
    }
};

export const LoadingEntityTable: Story = {
    args: {
        fetchEntity: fetchEntityLoading,
        columns: columnsFnBasicEntityTable({ onEdit, onDelete, onOpen }),
        filteredColumn: "name",
        entityKey: "entities",
        onCreate: () => alert("Create entity"),
        onOpen: onOpen,
    }
};
