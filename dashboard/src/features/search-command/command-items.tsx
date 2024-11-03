// CommandItems.tsx
import React, { FC } from "react";
import {
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@marzneshin/common/components";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { CommandGroupConfig, CommandItemConfig } from "./commands";

interface CommandItemsProps {
    items: CommandGroupConfig[];
    isSudo: () => boolean;
    setOpen: (open: boolean) => void;
}

export const CommandItems: FC<CommandItemsProps> = ({ items, isSudo, setOpen }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            {items.map((group: CommandGroupConfig, groupIndex: number) => (
                <React.Fragment key={group.group}>
                    <CommandGroup heading={group.group}>
                        {group.items.map((item: CommandItemConfig) => (
                            (!item.sudo || isSudo()) && (
                                <CommandItem
                                    key={item.label}
                                    onSelect={() => {
                                        navigate({ to: item.path });
                                        setOpen(false);
                                    }}
                                >
                                    <item.icon className="mr-2 size-4" />
                                    <span>{t(item.label)}</span>
                                </CommandItem>
                            )
                        ))}
                    </CommandGroup>
                    {groupIndex < items.length - 1 && <CommandSeparator />}
                </React.Fragment>
            ))}
        </>
    );
};
