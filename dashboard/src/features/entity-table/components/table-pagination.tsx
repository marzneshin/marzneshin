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
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import {
    useEntityTableContext
} from "@marzneshin/features/entity-table/contexts";
import { useEffect } from "react";

export function DataTablePagination() {
    const { t } = useTranslation();
    const { table } = useEntityTableContext();

    useEffect(() => {
        if (table.getState().pagination.pageIndex === 1) table.setPageIndex(2);
    }, [table]);

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
                    <p className="text-sm font-medium">{t("table.row-per-page")}</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                            table.setPageIndex(1);
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 50, 100].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-center items-center text-sm font-medium w-[100px]">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount() - 1}
                </div>
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
