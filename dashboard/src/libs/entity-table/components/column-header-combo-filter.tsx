import * as React from "react"
import { type Column } from "@tanstack/react-table";
import { useEntityTableContext } from "../contexts";
import { useScreenBreakpoint } from "@marzneshin/common/hooks";
import { useTranslation } from "react-i18next";
import {
    Button,
    Drawer,
    Command,
    Popover,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    DrawerContent,
    DrawerTrigger,
    PopoverContent,
    PopoverTrigger,
} from "@marzneshin/common/components"
import { cn } from "@marzneshin/common/utils";
import { Filter, FilterX } from "lucide-react";

interface DataTableColumnHeaderFilterOptionProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    options: string[]
    column: Column<TData, TValue>
}

export function DataTableColumnHeaderFilterOption<TData, TValue>(
    { title, column, options }: DataTableColumnHeaderFilterOptionProps<TData, TValue>
) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useScreenBreakpoint("md");
    const [selectedOption, setSelectedOption] = React.useState<string | null>(
        null
    )
    const { filters, table: { setPageIndex } } = useEntityTableContext();

    function handleClearingFilter() {
        filters.setColumnsFilter({ ...filters.columnsFilter, [column.id]: undefined });
        setSelectedOption(null);
        setPageIndex(1);
    }

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="data-[state=open]:bg-accent justify-start">
                        {selectedOption ? selectedOption : title}
                        <Button
                            variant="ghost"
                            onMouseDown={handleClearingFilter}
                            size="sm"
                            className={cn("p-2 ml-1", { "hover:text-destructive/90": !!selectedOption, "hover:text-primary/90": !selectedOption })}
                        >
                            {selectedOption ?
                                <FilterX className="size-4" />
                                :
                                <Filter className="size-4" />
                            }
                        </Button>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <ComboFilterOptionList setOpen={setOpen} columnName={column.id} setSelectedOption={(value) => { setSelectedOption(value); setPageIndex(1); }} options={options} />
                </PopoverContent>
            </Popover>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="data-[state=open]:bg-accent w-fit justify-start">
                    {selectedOption ? selectedOption : title}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <ComboFilterOptionList setOpen={setOpen} columnName={column.id} setSelectedOption={setSelectedOption} options={options} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

interface ComboFilterOptionListProps {
    setOpen: (open: boolean) => void
    setSelectedOption: (option: string | null) => void
    columnName: string
    options: string[]
}

function ComboFilterOptionList({
    setOpen,
    setSelectedOption,
    options,
    columnName,
}: ComboFilterOptionListProps) {
    const { filters } = useEntityTableContext();
    const { t } = useTranslation();
    return (
        <Command>
            <CommandInput className="border-0 focus:ring-0" placeholder="Filters..." />
            <CommandList>
                <CommandEmpty>{t("table.no-result-found")}</CommandEmpty>
                <CommandGroup>
                    {options.map((option) => (
                        <CommandItem
                            key={option}
                            value={option}
                            onSelect={(value) => {
                                setSelectedOption(value)
                                setOpen(false)
                                filters.setColumnsFilter({ ...filters.columnsFilter, [columnName]: value })
                            }}
                        >
                            {option}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}
