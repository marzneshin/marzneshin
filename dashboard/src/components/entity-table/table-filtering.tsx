
import { FC } from 'react'
import { Input } from '@marzneshin/components';
import { useEntityTableContext } from './entity-table-provider';
import { useTranslation } from 'react-i18next';

interface TableFilteringProps { }

export const TableFiltering: FC<TableFilteringProps> = () => {
    const { table, filtering } = useEntityTableContext()
    const { t } = useTranslation()
    return (
        <Input
            placeholder={t('table.filter-placeholder', { name: filtering.column })}
            value={(table.getColumn(filtering.column)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn(filtering.column)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
        />
    );
}
