import { ColumnDef, OnChangeFn, PaginationState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { UseFilteringReturn, UseRowSelectionReturn, UseSortingReturn, UseVisibilityReturn } from ".";

interface UseEntityTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: {
        entity: TData[]
        pageCount: number
    }
    filtering: UseFilteringReturn
    sorting: UseSortingReturn
    visibility: UseVisibilityReturn
    rowSelection: UseRowSelectionReturn
    pageIndex: number
    pageSize: number
    onPaginationChange: OnChangeFn<PaginationState>
}

export const useEntityTable = <TData, TValue>(
    {
        columns,
        data,
        filtering,
        sorting,
        visibility,
        rowSelection,
        pageIndex,
        pageSize,
        onPaginationChange
    }: UseEntityTableProps<TData, TValue>
) => useReactTable({
    data: data.entity,
    columns,
    manualPagination: true,
    pageCount: data.pageCount + 1,
    autoResetPageIndex: false,
    onPaginationChange,
    onSortingChange: sorting.setSorting,
    onColumnFiltersChange: filtering.setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: visibility.setColumnVisibility,
    onRowSelectionChange: rowSelection && rowSelection.setSelectedRow,
    state: {
        sorting: sorting.sorting,
        columnFilters: filtering.columnFilters,
        columnVisibility: visibility.columnVisibility,
        pagination: { pageIndex: pageIndex - 1, pageSize },
        rowSelection: rowSelection ? rowSelection.selectedRow : {},
    },
})
