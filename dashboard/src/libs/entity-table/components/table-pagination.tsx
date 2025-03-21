import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import {
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table"
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEntityTableContext } from "../contexts";

export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();
    const { entityKey } = useEntityTableContext();
    const [,setRowPerPageLocal] = useLocalStorage<number>(`marzneshin-table-row-per-page-${entityKey}`, 10);

    return (
        <div className="flex justify-between items-center p-2 w-full">
            {table.options.onRowSelectionChange && (
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} {"/"}
                    {table.getFilteredRowModel().rows.length} {t("table.selected")}
                </div>
            )}
            <div className="flex justify-between items-center space-x-6 w-full lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <label id="rows-per-page-label" htmlFor="rows-per-page-select" className="text-sm font-medium">
                        {t("table.row-per-page")}
                    </label>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                            table.setPageIndex(1);
                            setRowPerPageLocal(Number(value));
                        }}
                        aria-labelledby="rows-per-page-label"
                    >
                        <SelectTrigger
                            className="h-8 w-[70px]"
                            aria-controls="rows-per-page-listbox"
                            aria-labelledby="rows-per-page-label"
                        >
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent
                            id="rows-per-page-listbox"
                            side="top"
                            aria-labelledby="rows-per-page-label"
                        >
                            {[10, 20, 50, 100].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                    aria-selected={table.getState().pagination.pageSize === pageSize}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {(table.getPageCount() - 1) !== 0 &&
                    <div className="flex justify-center items-center text-sm font-medium w-[100px]">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount() - 1}
                    </div>
                }
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden p-0 w-8 h-8 lg:flex"
                        onClick={() => table.setPageIndex(1)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="p-0 w-8 h-8"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="p-0 w-8 h-8"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden p-0 w-8 h-8 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
