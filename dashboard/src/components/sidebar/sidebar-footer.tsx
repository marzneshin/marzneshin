import type { FC, PropsWithChildren } from "react"

export interface SidebarFooterProps
    extends PropsWithChildren {
}


export const SidebarFooter:FC<SidebarFooterProps> = ({children}) => {
    return (
        <div>{children}</div>
    )
}
