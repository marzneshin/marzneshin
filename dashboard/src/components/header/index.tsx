import { ThemeToggle } from "@marzneshin/features/theme-switch"
import { Link } from "@tanstack/react-router"
import { FC, PropsWithChildren } from "react"

export const Header: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex flex-row justify-between items-center p-1 px-4 w-full h-full bg-secondary text-primary-foreground dark:bg-primary-foreground">
            <div className="flex flex-row gap-4 justify-center items-center">
                <Link to="/">
                    <div className="flex flex-col justify-center items-center p-2 h-10 text-2xl font-bold rounded-lg font-header bg-accent text-primary border-accent">
                        M
                    </div>
                </Link>
                {children}
            </div>
            <div className="flex flex-row justify-reverse">
                <ThemeToggle />
            </div>
        </div>
    )
}
