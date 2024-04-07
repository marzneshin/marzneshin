import { OnChangeFn, VisibilityState } from "@tanstack/react-table"
import { useState } from "react"

export interface UseVisibilityReturn {
    columnVisibility: VisibilityState
    setColumnVisibility: OnChangeFn<VisibilityState>
}

export const useVisibility = () => {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    return { columnVisibility, setColumnVisibility }
}
