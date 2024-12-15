import { Row } from "@tanstack/react-table"
import { type PropsWithChildren, useCallback } from 'react'
import {
    type ColumnActions
} from "@marzneshin/libs/entity-table";

interface NoPropogationButtonProps<T> {
    actions: ColumnActions<T>,
    row: Row<T>,
}

export function NoPropogationButton<T>({ children, actions, row }: NoPropogationButtonProps<T> & PropsWithChildren) {
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            actions.onOpen(row.original);
        }
    }, [actions, row.original]);

    return (
        <div
            className="flex flex-row gap-2 items-center"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
        >
            {children}
        </div>
    )
}

