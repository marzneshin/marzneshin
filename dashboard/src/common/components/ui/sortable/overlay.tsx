
import {
    type DropAnimation,
    type UniqueIdentifier,
    defaultDropAnimationSideEffects,
    DragOverlay,
} from "@dnd-kit/core";
import { SortableItem} from "./item";

const dropAnimationOpts: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: "0.4",
            },
        },
    }),
}
interface SortableOverlayProps
    extends React.ComponentPropsWithRef<typeof DragOverlay> {
    activeId?: UniqueIdentifier | null
}

export function SortableOverlay({
    activeId,
    dropAnimation = dropAnimationOpts,
    children,
    ...props
}: SortableOverlayProps) {
    return (
        <DragOverlay dropAnimation={dropAnimation} {...props}>
            {activeId ? (
                <SortableItem value={activeId} asChild>
                    {children}
                </SortableItem>
            ) : null}
        </DragOverlay>
    )
}

