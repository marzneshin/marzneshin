import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    CommandDialog,
    CommandEmpty,
    CommandInput,
    CommandList,
    ScrollArea,
} from "@marzneshin/components";
import { SearchBox } from "./search-box";
import { useAuth } from "@marzneshin/features/auth";
import { CommandItems } from "./command-items";
import { commandItems } from "./commands";

export function CommandBox() {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { isSudo } = useAuth();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <SearchBox onClick={() => setOpen(true)} />
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Type a command or search..."
                    className="focus:ring-0 ring-0 m-1 border-none"
                />
                <ScrollArea className="max-h-100">
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandItems items={commandItems} isSudo={isSudo} setOpen={setOpen} />
                    </CommandList>
                </ScrollArea>
            </CommandDialog>
        </>
    );
}


