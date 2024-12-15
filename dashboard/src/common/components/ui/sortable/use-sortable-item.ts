import React from "react";
import { SortableItemContext} from "./context";

export function useSortableItem() {
    const context = React.useContext(SortableItemContext)

    if (!context) {
        throw new Error("useSortableItem must be used within a SortableItem")
    }

    return context
}
