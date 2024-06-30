import {
    Button,
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
import {
    useUserUsageResetCmd,
    type UserType
} from "@marzneshin/features/users";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QRCodeSection, UserInfoTable } from "./user-info";
import { SubscriptionActions } from "./user-info/subscription-actions";
import { UserStatusEnableButton } from "./user-info/user-status-enable-button";

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
    const { mutate: resetUsage } = useUserUsageResetCmd();

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
                                {t("user_info")}
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="services">
                                {t("services")}
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="subscription">
                                {t("subscription")}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="info"
                            className="flex flex-col gap-2 w-full h-full"
                        >
                            <UserInfoTable entity={entity} />
                            <div className="flex flex-row justify-center items-center gap-2">
                                <Button className="w-1/2" onClick={() => resetUsage(entity)}>
                                    {t("page.users.reset_usage")}
                                </Button>
                                <UserStatusEnableButton user={entity} />
                            </div>
                        </TabsContent>
                        <TabsContent value="services">
                            <UserServicesTable user={entity} />
                        </TabsContent>
                        <TabsContent value="subscription">
                            <QRCodeSection entity={entity} />
                            <SubscriptionActions entity={entity} />
                        </TabsContent>
                    </Tabs>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
};
