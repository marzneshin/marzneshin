import type { FC, HTMLAttributes } from "react";
import { SearchIcon } from "lucide-react";

export const SearchBox: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
    return (
        <div
            className="bg-gray-800 p-2 md:w-60 flex flex-row items-center rounded-md justify-between"
            {...props}
        >
            <div className="flex flex-row items-center gap-1">
                <SearchIcon className="size-4 text-muted dark:text-muted-foreground" />
                <p className="text-sm text-muted dark:text-muted-foreground ">Search</p>
            </div>
            <kbd className="pointer-events-none md:inline-flex h-5 select-none items-center gap-1 rounded bg-gray-600 px-1.5 font-mono text-[10px] font-medium text-muted dark:text-muted-foreground hidden">
                <span className="text-xs">CTRL</span>K
            </kbd>
        </div>
    );
};
