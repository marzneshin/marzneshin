import { ColumnFiltersState, OnChangeFn } from "@tanstack/react-table"
import { useState } from "react"

export interface UseFilteringType {
    column: string
}

export interface UseFilteringReturn extends UseFilteringType {
    columnFilters: ColumnFiltersState
    setColumnFilters: OnChangeFn<ColumnFiltersState>
}

export const useFiltering = ({ column }: UseFilteringType): UseFilteringReturn => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    return { setColumnFilters, columnFilters, column }
}
