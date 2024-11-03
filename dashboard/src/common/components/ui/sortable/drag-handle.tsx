import React from "react";
import { Button, type ButtonProps } from "@marzneshin/common/components"
import { useSortableItem } from "./use-sortable-item";
import { composeRefs, cn } from "@marzneshin/common/utils";

interface SortableDragHandleProps extends ButtonProps {
    withHandle?: boolean
}

export const SortableDragHandle = React.forwardRef<
    HTMLButtonElement,
    SortableDragHandleProps
>(({ className, ...props }, ref) => {
    const { attributes, listeners } = useSortableItem()

    return (
        <Button
            ref={composeRefs(ref)}
            className={cn("cursor-grab", className)}
            {...attributes}
            {...listeners}
            {...props}
        />
    )
})
SortableDragHandle.displayName = "SortableDragHandle"
