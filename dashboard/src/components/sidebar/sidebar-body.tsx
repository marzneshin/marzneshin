import { FC, PropsWithChildren } from "react"

export interface SidebarBodyProps
    extends PropsWithChildren {

}

export const SidebarBody: FC<SidebarBodyProps> = ({ children }) => {
    return (
        <ul className="flex flex-col justify-center items-start w-full divide-y-[3px] divide-accent">
            {children}
        </ul>
    )
}
