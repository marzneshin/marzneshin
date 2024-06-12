import type { FC } from "react";


interface HeaderProps {
    start?: React.ReactNode;
    center?: React.ReactNode;
    end?: React.ReactNode;
}

export const Header: FC<HeaderProps> = ({ start, center, end }) => (
    <header className="h-[3.5rem]">
        <div className="flex flex-row justify-between justify-items-stretch items-center lg:grid grid-cols-3 p-1 px-4 w-full h-full bg-primary text-primary-foreground dark:bg-primary-foreground">
            <div className="flex flex-row gap-2 justify-center-start justify-start items-center">
                {start}
            </div>
            <div className="justify-center justify-self-center">
                {center}
            </div>
            <div className="flex flex-row gap-2 h-10 justify-end  justify-self-end items-center">
                {end}
            </div>
        </div>
    </header>
);
