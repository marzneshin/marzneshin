import { FC, PropsWithChildren } from "react";
import {
    ScrollArea,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";

export interface SettingsDialogProps {
    onOpenChange: (state: boolean) => void;
    open: boolean;
}

export const SettingsDialog: FC<SettingsDialogProps & PropsWithChildren> = ({
    open, onOpenChange, children
}) => {
    const { t } = useTranslation();
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:min-w-full md:min-w-[700px] space-y-5">
                <SheetHeader >
                    <SheetTitle>{t("settings")}</SheetTitle>
                </SheetHeader>
                <ScrollArea className="flex flex-col gap-4 h-full">
                    {children}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
