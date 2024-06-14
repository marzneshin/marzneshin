import { OnChangeFn } from "@tanstack/react-table"
import { useState } from "react"

export interface UseFilteringType {
    column: string
}

export interface UseFilteringReturn extends UseFilteringType {
    columnFilters: string
    setColumnFilters: OnChangeFn<string>
}

export const useFiltering = ({ column }: UseFilteringType): UseFilteringReturn => {
    const [columnFilters, setColumnFilters] = useState<string>("")
    return { setColumnFilters, columnFilters, column }
}
