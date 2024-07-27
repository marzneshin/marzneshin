import React from "react";
import {
    CommandGroup,
    CommandItem,
    CommandSeparator,
} from "@marzneshin/components";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function CommandItems({ items, isSudo, setOpen }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            {items.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                    <CommandGroup heading={group.group}>
                        {group.items.map((item, itemIndex) => (
                            (!item.sudo || isSudo()) && (
                                <CommandItem
                                    key={itemIndex}
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
}
