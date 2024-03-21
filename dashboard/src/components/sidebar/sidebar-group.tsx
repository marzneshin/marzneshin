
import { FC, PropsWithChildren } from "react"
import { Label } from "@marzneshin/components"
import { useSidebarContext } from "./sidebar-provider";

export interface SidebarGroupProps
    extends PropsWithChildren {

}

export const SidebarGroup: FC<SidebarGroupProps> = ({ children }) => {
    const { collapsed } = useSidebarContext();

    if (!collapsed)
        return (
            <Label className="text-gray-500 font-header">
                {children}
            </Label>
        )
}
