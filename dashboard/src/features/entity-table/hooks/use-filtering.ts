import { OnChangeFn } from "@tanstack/react-table"
import { useState } from "react"

export interface UseFiltersReturn {
    columnsFilter: Record<string, string>
    setColumnsFilter: OnChangeFn<Record<string, string>>
}

export const useFilters = (): UseFiltersReturn => {
    const [columnsFilter, setColumnsFilter] = useState<Record<string, string>>({})
    return { columnsFilter, setColumnsFilter }
}
