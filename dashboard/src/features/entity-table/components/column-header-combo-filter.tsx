import * as React from "react"

import { useScreenBreakpoint } from "@marzneshin/hooks";
import {
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Drawer,
    DrawerContent,
    DrawerTrigger,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@marzneshin/components"

interface DataTableColumnHeaderFilterOptionProps
    extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    options: string[]
}

export function DataTableColumnHeaderFilterOption({
    title, options
}: DataTableColumnHeaderFilterOptionProps) {

    const [open, setOpen] = React.useState(false)
    const isDesktop = useScreenBreakpoint("md");
    const [selectedOption, setSelectedOption] = React.useState<string | null>(
        null
    )

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="data-[state=open]:bg-accent w-fit justify-start">
                        {selectedOption ? selectedOption : title}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <ComboFilterOptionList setOpen={setOpen} setSelectedOption={setSelectedOption} options={options} />
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
                    <ComboFilterOptionList setOpen={setOpen} setSelectedOption={setSelectedOption} options={options} />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

interface ComboFilterOptionListProps {
    setOpen: (open: boolean) => void
    setSelectedOption: (option: string | null) => void
    options: string[]
}

// TODO: tokenize for i18n
function ComboFilterOptionList({
    setOpen,
    setSelectedOption,
    options,
}: ComboFilterOptionListProps) {
    return (
        <Command>
            <CommandInput placeholder="Filter status..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {options.map((option) => (
                        <CommandItem
                            key={option}
                            value={option}
                            onSelect={(value) => {
                                setSelectedOption(value)
                                setOpen(false)
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
