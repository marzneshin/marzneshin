import {
    ColumnDef,
    ColumnFiltersState,
    OnChangeFn,
    RowSelectionState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Button,
} from "@marzneshin/common/components"

import { useTranslation } from "react-i18next"
import { DataTablePagination } from "./table-pagination"
import { useState } from "react"
import { DataTableViewOptions } from "./table-view-option"
import { TableSearch } from "./table-filtering"
import { EntityDataTable } from "./table";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filteredColumn: string
    onCreate?: () => void
    onOpen?: (object: TData) => void
    setSelectedRow?: OnChangeFn<RowSelectionState> | undefined
    selectedRow?: RowSelectionState | undefined
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onCreate,
    onOpen,
    selectedRow,
    setSelectedRow,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setSelectedRow,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection: selectedRow !== undefined ? selectedRow : {},
        },
    })
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex items-center py-4">
                <TableSearch />
                <DataTableViewOptions table={table} />
                {onCreate && (<Button onClick={onCreate}>{t('create')}</Button>)}
            </div>
            <div className="rounded-md border">
                <EntityDataTable columns={columns} onRowClick={onOpen} />
                <DataTablePagination table={table} />
            </div>
        </div>
    )
}
