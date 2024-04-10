import {
    ColumnDef,
    flexRender,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@marzneshin/components"

import { useTranslation } from "react-i18next"
import { useEntityTableContext } from "./entity-table-provider"
import { LoaderCircle } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    onRowClick?: (object: TData) => void
}

export function EntityDataTable<TData, TValue>({
    columns,
    onRowClick,
}: DataTableProps<TData, TValue>) {
    const { t } = useTranslation();
    const { table, isLoading } = useEntityTableContext()
    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            )
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {isLoading ? (
                    <TableRow className="w-full">
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            <LoaderCircle className="w-5 h-5 animate-spin text-primary" />
                        </TableCell>
                    </TableRow>
                ) : (
                    table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                data-testid={"entity-table-row"}
                                onClick={() => onRowClick && onRowClick(row.original)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {t('table.no-result')}
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </Table>
    )
}
