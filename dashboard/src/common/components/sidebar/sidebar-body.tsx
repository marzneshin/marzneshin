import { cn } from "@marzneshin/common/utils"
import { FC, PropsWithChildren } from "react"

export interface SidebarBodyProps
    extends PropsWithChildren,
    React.HTMLAttributes<HTMLUListElement> { }

export const SidebarBody: FC<SidebarBodyProps> = ({ children, className }) => {
    return (
        <ul className={cn(className, "flex flex-col justify-center items-start w-full")}>
            {children}
        </ul>
    )
}
