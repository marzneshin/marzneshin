import {
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Skeleton
} from "@marzneshin/common/components";
import { useTranslation } from "react-i18next";
import { useEntityTableContext } from "@marzneshin/libs/entity-table/contexts";
import { type FC } from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    onRowClick?: (object: TData) => void
}

const Headers = () => {
    const { table } = useEntityTableContext();
    return (
        table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                        {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                ))}
            </TableRow>
        ))
    )
};

const Rows: FC<Readonly<DataTableProps<any, any>>> = ({
    columns,
    onRowClick
}) => {
    const { table } = useEntityTableContext();
    const { t } = useTranslation();

    return (table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map(row => (
            <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                data-testid="entity-table-row"
                onClick={() => onRowClick?.(row.original)}
            >
                {row.getVisibleCells().map(cell => (
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
    ))
};

const Loading = () => (
    <>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={`skeleton-row-${rowIndex}`} className="w-full">
                <TableCell className="h-12">
                    <Skeleton className="w-full h-full" />
                </TableCell>
                <TableCell className="h-12">
                    <Skeleton className="w-full h-full" />
                </TableCell>
                <TableCell className="h-12">
                    <Skeleton className="w-full h-full" />
                </TableCell>
                <TableCell className="h-12">
                    <Skeleton className="w-full h-full" />
                </TableCell>
                <TableCell className="h-12">
                    <Skeleton className="w-full h-full" />
                </TableCell>
            </TableRow>
        ))}
    </>
);

export function EntityDataTable<TData, TValue>({
    columns,
    onRowClick,
}: Readonly<DataTableProps<TData, TValue>>) {
    const { isLoading } = useEntityTableContext();

    return (
        <Table className="w-full">
            <TableHeader> <Headers /> </TableHeader>
            <TableBody>
                {isLoading ? <Loading /> : <Rows onRowClick={onRowClick} columns={columns} />}
            </TableBody>
        </Table>
    );
}
