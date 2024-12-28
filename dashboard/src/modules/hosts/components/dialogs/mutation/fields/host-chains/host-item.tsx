import {
    Button,
    SortableDragHandle,
    SortableItem,
} from "@marzneshin/common/components";
import { HostType } from "@marzneshin/modules/hosts";
import { useFormContext, UseFieldArrayRemove } from "react-hook-form";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";

interface RuleItemProps {
    index: number;
    host: HostType;
    onRemove: UseFieldArrayRemove;
}

export const HostItem = ({ host, index, onRemove: remove }: RuleItemProps) => {
    const form = useFormContext();

    return (
        <SortableItem key={field.id} value={field.id} asChild>
            <div className="grid grid-cols-[2fr,1.3fr,0.25fr,0.25fr] items-center justify-start gap-2 my-2">
                <SortableDragHandle
                    variant="outline"
                    size="icon"
                    className="size-8 shrink-0"
                >
                    <DragHandleDots2Icon
                        className="size-4"
                        aria-hidden="true"
                    />
                </SortableDragHandle>
                {host.remark}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => remove(index)}
                >
                    <TrashIcon
                        className="size-4 text-destructive"
                        aria-hidden="true"
                    />
                    <span className="sr-only">Remove</span>
                </Button>
            </div>
        </SortableItem>
    );
};
