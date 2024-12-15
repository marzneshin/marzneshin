import type {
    DraggableSyntheticListeners,
} from "@dnd-kit/core"
import React from "react";

interface SortableItemContextProps {
    attributes: React.HTMLAttributes<HTMLElement>
    listeners: DraggableSyntheticListeners | undefined
}

export const SortableItemContext = React.createContext<SortableItemContextProps>({
    attributes: {},
    listeners: undefined,
})
