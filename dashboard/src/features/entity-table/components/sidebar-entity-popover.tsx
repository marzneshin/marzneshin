import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@marzneshin/components";
import {
    SidebarEntitySelection
} from "@marzneshin/features/entity-table/components";
import { FC } from "react";

interface SidebarEntityTablePopoverProps {
    buttonChild: React.ReactElement;
}

export const SidebarEntityTablePopover: FC<SidebarEntityTablePopoverProps> = ({
    buttonChild,
}) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button
                variant="outline"
                className="mr-1 lg:flex"
            >
                {buttonChild}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
            <SidebarEntitySelection />
        </PopoverContent>
    </Popover>
)
