import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type {
    ColumnDef,
    OnChangeFn,
    PaginationState,
} from "@tanstack/react-table";
import type {
    UseRowSelectionReturn,
    UseSortingReturn,
    UseVisibilityReturn,
} from ".";

interface UseEntityTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: {
        entities: TData[];
        pageCount: number;
    };
    sorting: UseSortingReturn;
    visibility: UseVisibilityReturn;
    rowSelection?: UseRowSelectionReturn;
    manualSorting?: boolean;
    pageIndex: number;
    pageSize: number;
    onPaginationChange: OnChangeFn<PaginationState>;
}

export const useEntityTable = <TData, TValue>({
    columns,
    data,
    sorting,
    manualSorting = false,
    visibility,
    rowSelection,
    pageIndex,
    pageSize,
    onPaginationChange,
}: UseEntityTableProps<TData, TValue>) =>
    useReactTable({
        data: data.entities,
        columns,
        manualPagination: true,
        manualSorting,
        pageCount: data.pageCount + 1,
        autoResetPageIndex: false,
        onPaginationChange,
        onSortingChange: sorting.setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: visibility.setColumnVisibility,
        onRowSelectionChange: rowSelection?.setSelectedRow,
        state: {
            sorting: sorting.sorting,
            columnVisibility: visibility.columnVisibility,
            pagination: { pageIndex: pageIndex - 1, pageSize: pageSize },
            rowSelection: rowSelection ? rowSelection.selectedRow : {},
        },
    });
