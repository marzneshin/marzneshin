import { HeaderMenu } from "./menu";
import { GithubRepo } from "@marzneshin/features/github-repo";
import { Link } from "@tanstack/react-router";
import { CommandBox } from "@marzneshin/features/search-command";
import type { FC, PropsWithChildren } from "react";
import { useScreenBreakpoint } from "@marzneshin/hooks/use-screen-breakpoint";

export const Header: FC<PropsWithChildren> = ({ children }) => {
    const isDesktop = useScreenBreakpoint("md");

    return (
        <div className="flex flex-row justify-between items-center p-1 px-4 w-full h-full bg-primary text-primary-foreground dark:bg-primary-foreground">
            <div className="flex flex-row gap-4 justify-center items-center">
                <Link to="/">
                    <div className="flex flex-col justify-center items-center p-2 h-10 text-2xl font-bold bg-gray-800 rounded-lg font-header text-secondary border-accent dark:text-secondary-foreground">
                        M
                    </div>
                </Link>
                {children}
                <CommandBox />
            </div>
            <div className="flex flex-row gap-2 h-10">
                <GithubRepo variant={isDesktop ? "full" : "mini"} />
                <HeaderMenu />
            </div>
        </div>
    );
};
