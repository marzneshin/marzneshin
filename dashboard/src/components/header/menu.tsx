import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    Button,
} from "@marzneshin/components";
import { FC } from 'react';
import { MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitchMenu } from "@marzneshin/features/language-switch";
import { ThemeToggle } from "@marzneshin/features/theme-switch";
import { Logout } from "@marzneshin/features/auth";

export const HeaderMenu: FC = () => {
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="secondary"
                    className="bg-gray-800 text-secondary dark:hover:bg-secondary-foreground dark:hover:text-secondary dark:text-secondary-foreground"
                    size="icon"
                >
                    <MenuIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <LanguageSwitchMenu />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <ThemeToggle />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="w-full">
                    <Logout />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu >
    );
};
