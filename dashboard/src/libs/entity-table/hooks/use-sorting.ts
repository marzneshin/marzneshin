import { OnChangeFn, SortingState } from "@tanstack/react-table"
import { useState } from "react"

export interface UseSortingReturn {
    sorting: SortingState
    setSorting: OnChangeFn<SortingState>
}

export const useSorting = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    return { sorting, setSorting }
}
