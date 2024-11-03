import React from "react"
import { CSS } from "@dnd-kit/utilities"
import { Slot, type SlotProps } from "@radix-ui/react-slot"
import { useSortable } from "@dnd-kit/sortable"
import { composeRefs, cn } from "@marzneshin/common/utils"
import type {
    UniqueIdentifier,
} from "@dnd-kit/core"

import { SortableItemContext } from "./context"

interface SortableItemProps extends SlotProps {
    value: UniqueIdentifier
    asChild?: boolean
}

export const SortableItem = React.forwardRef<HTMLDivElement, SortableItemProps>(
    ({ asChild, className, value, ...props }, ref) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: value })

        const context = React.useMemo(
            () => ({
                attributes,
                listeners,
            }),
            [attributes, listeners]
        )
        const style: React.CSSProperties = {
            opacity: isDragging ? 0.4 : undefined,
            transform: CSS.Translate.toString(transform),
            transition,
        }

        const Comp = asChild ? Slot : "div"

        return (
            <SortableItemContext.Provider value={context}>
                <Comp
                    className={cn(isDragging && "cursor-grabbing", className)}
                    ref={composeRefs(ref, setNodeRef as React.Ref<HTMLDivElement>)}
                    style={style}
                    {...props}
                />
            </SortableItemContext.Provider>
        )
    }
)
SortableItem.displayName = "SortableItem"
