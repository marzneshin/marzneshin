import { OnChangeFn } from "@tanstack/react-table"
import { useState } from "react"

export interface UseFiltersReturn {
    columnsFilter: Record<string, string | undefined>
    setColumnsFilter: OnChangeFn<Record<string, string | undefined>>
}

export const useFilters = (): UseFiltersReturn => {
    const [columnsFilter, setColumnsFilter] = useState<Record<string, string | undefined>>({})
    return { columnsFilter, setColumnsFilter }
}
