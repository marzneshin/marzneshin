
import { type FC } from "react";
import { Input } from "@marzneshin/components";
import {
    useEntityTableContext
} from "@marzneshin/features/entity-table/contexts";
import { useTranslation } from "react-i18next";

interface TableSearchProps { }

export const TableSearch: FC<TableSearchProps> = () => {
    const { primaryFilter } = useEntityTableContext()
    const { t } = useTranslation()
    return (
        <Input
            placeholder={t('table.filter-placeholder', { name: primaryFilter.column })}
            value={primaryFilter.columnFilters}
            onChange={(e) => primaryFilter.setColumnFilters(e.target.value)}
            className=" w-full md:w-[20rem]"
        />
    );
}
