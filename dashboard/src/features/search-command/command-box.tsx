import {
  UsersIcon,
  ServerIcon,
  BoxIcon,
  ServerCogIcon,
  SettingsIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@marzneshin/components";
import { useNavigate } from "@tanstack/react-router";
import { SearchBox } from "./search-box";

export function CommandBox() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

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
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem
              onSelect={() => {
                navigate({ to: "/users" });
                setOpen(false);
              }}
            >
              <UsersIcon className="mr-2 size-4" />
              <span>{t("users")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/services" });
                setOpen(false);
              }}
            >
              <ServerIcon className="mr-2 size-4" />
              <span>{t("services")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/nodes" });
                setOpen(false);
              }}
            >
              <BoxIcon className="mr-2 h-4 w-4" />
              <span>{t("nodes")}</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/hosts" });
                setOpen(false);
              }}
            >
              <ServerCogIcon className="mr-2 h-4 w-4" />
              <span>{t("hosts")}</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              onSelect={() => {
                navigate({ to: "/settings" });
                setOpen(false);
              }}
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>{t("settings")}</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
