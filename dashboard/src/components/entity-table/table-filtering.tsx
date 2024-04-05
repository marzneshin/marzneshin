
import { FC } from 'react'
import { Input } from '@marzneshin/components';
import { useEntityTableContext } from './entity-table-provider';

interface TableFilteringProps { }

export const TableFiltering: FC<TableFilteringProps> = () => {
    const { table, filtering } = useEntityTableContext()
    if (filtering) {
        return (
            <Input
                value={(table.getColumn(filtering.column)?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn(filtering.column)?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />
        );
    }
}
