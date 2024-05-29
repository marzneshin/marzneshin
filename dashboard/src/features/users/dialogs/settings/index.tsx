import {
    ScrollArea,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@marzneshin/components";
import { UserServicesTable } from "@marzneshin/features/users";
import type { UserType } from "@marzneshin/features/users";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSection, UserInfoTable } from "./user-info";
import { SubscriptionActions } from "./user-info/subscription-actions";

interface UsersSettingsDialogProps {
    onOpenChange: (state: boolean) => void;
    open: boolean;
    entity: UserType;
    onClose: () => void;
}

export const UsersSettingsDialog: FC<UsersSettingsDialogProps> = ({
    onOpenChange,
    open,
    entity,
    onClose,
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:min-w-full md:min-w-[700px]">
                <ScrollArea className="flex flex-col gap-4 m-3 h-full">
                    <SheetHeader className="my-1">
                        <SheetTitle>{t("settings")}</SheetTitle>
                    </SheetHeader>
                    <Tabs defaultValue="info" className="w-full h-full">
                        <TabsList className="w-full bg-accent">
                            <TabsTrigger className="w-full" value="info">
                                {" "}
                                {t("user_info")}{" "}
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="services">
                                {" "}
                                {t("services")}{" "}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="info"
                            className="flex flex-col gap-2 w-full h-full"
                        >
                            <UserInfoTable entity={entity} />
                            <QRCodeSection entity={entity} />
                            <SubscriptionActions entity={entity} />
                        </TabsContent>
                        <TabsContent value="services">
                            <UserServicesTable user={entity} />
                        </TabsContent>
                    </Tabs>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
