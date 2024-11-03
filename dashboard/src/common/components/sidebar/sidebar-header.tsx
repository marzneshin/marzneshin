import { cn } from "@marzneshin/common/utils"
import { FC, PropsWithChildren } from "react"

export interface SidebarHeaderProps extends
    PropsWithChildren,
    React.HTMLAttributes<HTMLLinkElement> { }

export const SidebarHeader: FC<SidebarHeaderProps> = ({ children, className }) => {
    return (
        <div className={cn(className)}>{children}</div>
    )
}
