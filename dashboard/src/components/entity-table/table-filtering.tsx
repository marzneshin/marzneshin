
import { FC } from 'react'
import { Input } from '@marzneshin/components';
import { useEntityTableContext } from './entity-table-provider';
import { useTranslation } from 'react-i18next';

interface TableFilteringProps { }

export const TableFiltering: FC<TableFilteringProps> = () => {
    const { filtering } = useEntityTableContext()
    const { t } = useTranslation()
    return (
        <Input
            placeholder={t('table.filter-placeholder', { name: filtering.column })}
            value={filtering.columnFilters}
            onChange={(e) => filtering.setColumnFilters(e.target.value)}
            className="max-w-sm w-[12rem] md:w-[20rem]"
        />
    );
}
