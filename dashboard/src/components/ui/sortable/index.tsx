import React from "react"
import type {
    DndContextProps,
    UniqueIdentifier,
} from "@dnd-kit/core";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    restrictToParentElement,
    restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    type SortableContextProps,
} from "@dnd-kit/sortable";
import { SortableDragHandle } from "./drag-handle";
import { SortableItem } from "./item";
import { SortableOverlay } from "./overlay";

interface SortableProps<TData extends { id: UniqueIdentifier }>
    extends DndContextProps {
    /**
     * An array of data items that the sortable component will render.
     * @example
     * value={[
     *   { id: 1, name: 'Item 1' },
     *   { id: 2, name: 'Item 2' },
     * ]}
     */
    value: TData[]

    /**
     * An optional callback function that is called when the order of the data items changes.
     * It receives the new array of items as its argument.
     * @example
     * onValueChange={(items) => console.log(items)}
     */
    onValueChange?: (items: TData[]) => void

    /**
     * An optional callback function that is called when an item is moved.
     * It receives an event object with `activeIndex` and `overIndex` properties, representing the original and new positions of the moved item.
     * This will override the default behavior of updating the order of the data items.
     * @type (event: { activeIndex: number; overIndex: number }) => void
     * @example
     * onMove={(event) => console.log(`Item moved from index ${event.activeIndex} to index ${event.overIndex}`)}
     */
    onMove?: (event: { activeIndex: number; overIndex: number }) => void

    /**
     * A collision detection strategy that will be used to determine the closest sortable item.
     * @default closestCenter
     * @type DndContextProps["collisionDetection"]
     */
    collisionDetection?: DndContextProps["collisionDetection"]

    /**
     * An array of modifiers that will be used to modify the behavior of the sortable component.
     * @default
     * [restrictToVerticalAxis, restrictToParentElement]
     * @type Modifier[]
     */
    modifiers?: DndContextProps["modifiers"]

    /**
     * A sorting strategy that will be used to determine the new order of the data items.
     * @default verticalListSortingStrategy
     * @type SortableContextProps["strategy"]
     */
    strategy?: SortableContextProps["strategy"]

    /**
     * An optional React node that is rendered on top of the sortable component.
     * It can be used to display additional information or controls.
     * @default null
     * @type React.ReactNode | null
     * @example
     * overlay={<Skeleton className="w-full h-8" />}
     */
    overlay?: React.ReactNode | null
}

function Sortable<TData extends { id: UniqueIdentifier }>({
    value,
    onValueChange,
    collisionDetection = closestCenter,
    modifiers = [restrictToVerticalAxis, restrictToParentElement],
    strategy = verticalListSortingStrategy,
    onMove,
    children,
    overlay,
    ...props
}: SortableProps<TData>) {
    const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor)
    )

    return (
        <DndContext
            modifiers={modifiers}
            sensors={sensors}
            onDragStart={({ active }) => setActiveId(active.id)}
            onDragEnd={({ active, over }) => {
                if (over && active.id !== over?.id) {
                    const activeIndex = value.findIndex((item) => item.id === active.id)
                    const overIndex = value.findIndex((item) => item.id === over.id)

                    if (onMove) {
                        onMove({ activeIndex, overIndex })
                    } else {
                        onValueChange?.(arrayMove(value, activeIndex, overIndex))
                    }
                }
                setActiveId(null)
            }}
            onDragCancel={() => setActiveId(null)}
            collisionDetection={collisionDetection}
            {...props}
        >
            <SortableContext items={value} strategy={strategy}>
                {children}
            </SortableContext>
            {overlay ? (
                <SortableOverlay activeId={activeId}>{overlay}</SortableOverlay>
            ) : null}
        </DndContext>
    )
}


export { Sortable, SortableDragHandle, SortableItem, SortableOverlay }
