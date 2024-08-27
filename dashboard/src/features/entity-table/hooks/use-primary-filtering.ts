import { OnChangeFn } from "@tanstack/react-table"
import { useState } from "react"

export interface UsePrimaryFilterType {
    column: string
}

export interface UsePrimaryFilterReturn extends UsePrimaryFilterType {
    columnFilters: string
    setColumnFilters: OnChangeFn<string>
}

export const usePrimaryFiltering = ({ column }: UsePrimaryFilterType): UsePrimaryFilterReturn => {
    const [columnFilters, setColumnFilters] = useState<string>("")
    return { setColumnFilters, columnFilters, column }
}
