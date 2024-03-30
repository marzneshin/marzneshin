
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Button,
    Input,
    DataTablePagination,
    DataTableViewOptions,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Label,
    ToggleGroup,
    ToggleGroupItem,
    ScrollArea
} from "@marzneshin/components"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { InboundType } from "@marzneshin/features/inbounds"
import { Server } from "lucide-react"
import { InboundOption } from "./inbound"

interface InboundHostsDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    inbounds: InboundType[]
    filteredColumn: string
    selectedInbound: string | undefined
    setSelectedInbound: (s: string) => void
    onCreate?: () => void
    onOpen?: (object: TData) => void
}

export function InboundHostsDataTable<TData, TValue>({
    columns,
    data,
    onCreate,
    onOpen,
    filteredColumn,
    inbounds,
    selectedInbound,
    setSelectedInbound,
}: InboundHostsDataTableProps<TData, TValue>) {
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
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })
    const { t } = useTranslation();
    return (
        <div>
            <div className="flex justify-between items-center py-4">
                <Input
                    placeholder={t('table.filter-placeholder', { name: filteredColumn })}
                    value={(table.getColumn(filteredColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn(filteredColumn)?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex items-center">
                    <Popover >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="mr-2 ml-auto lg:flex"
                            >
                                <Server className="mr-2 w-4 h-4" />
                                {t('inbounds')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 max-h-100">
                            <ToggleGroup type="single" onValueChange={setSelectedInbound} defaultValue={selectedInbound} className="flex flex-col justify-center w-full h-full" >
                                <ScrollArea className="w-full h-full">
                                    {inbounds.map((inbound) => {
                                        return <ToggleGroupItem className="px-0 w-full h-full" value={String(inbound.id)} id={String(inbound.id)}>
                                            <InboundOption inbound={inbound} />
                                        </ToggleGroupItem>
                                    })}
                                </ScrollArea>
                            </ToggleGroup>
                        </PopoverContent>
                    </Popover>
                    <DataTableViewOptions table={table} />
                    {onCreate && (<Button onClick={onCreate}>{t('create')}</Button>)}
                </div>
            </div>
            <div className="rounded-md border">
                <div>
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
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => onOpen !== undefined && onOpen(row.original)}
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
                            )}
                        </TableBody>
                    </Table>

                </div>
                <DataTablePagination table={table} />
            </div>
        </div >
    )
}
