mport { HostsSelectionQuery } from "./host-selection";
import {
    Button,
    SortableDragHandle,
    SortableItem,
} from "@marzneshin/common/components";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";

import { HostType } from "@marzneshin/modules/hosts/domain";

interface HostChainItemProps {
    field: Record<"id", string>;
    hostItemData: HostType;
    removeHost: (id: number) => void;
    index: number;
}

export function HostChainItem({
    field, hostItemData, removeHost, index 
}: HostChainItemProps) {
    return <SortableItem key={field.id}
        value={field.id}
        asChild
    >
        <div className="grid grid-cols-[0.25fr,2fr,0.25fr] items-center justify-start gap-2 my-2">
            <SortableDragHandle
                variant="outline"
                size="icon"
                className="size-8 shrink-0"
            >
                <DragHandleDots2Icon
                    className="size-4"
                    aria-hidden="true" />
            </SortableDragHandle>
            {hostItemData.remark}
            <Button
                variant="outline"
                size="icon"
                className="size-8 shrink-0"
                onClick={() => removeHost(index)}
            >
                <TrashIcon
                    className="size-4 text-destructive"
                    aria-hidden="true" />
                <span className="sr-only">
                    Remove
                </span>
            </Button>
        </div>
    </SortableItem>;
}
