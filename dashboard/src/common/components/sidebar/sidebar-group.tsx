
import { FC, PropsWithChildren } from "react"
import { Label } from "@marzneshin/common/components"
import { cn } from "@marzneshin/common/utils"
import { useSidebarContext } from "./sidebar-provider";

export interface SidebarGroupProps
    extends PropsWithChildren {
    className: string
}

export const SidebarGroup: FC<SidebarGroupProps> = ({ children, className }) => {
    const { collapsed } = useSidebarContext();

    if (!collapsed)
        return (
            <Label className={cn(className, "text-gray-500 font-header")}>
                {children}
            </Label>
        )
}
