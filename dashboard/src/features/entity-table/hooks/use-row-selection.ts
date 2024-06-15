import { OnChangeFn, RowSelectionState } from "@tanstack/react-table"

export interface UseRowSelectionReturn {
    setSelectedRow: OnChangeFn<RowSelectionState>
    selectedRow: RowSelectionState
}
