import {
    Button,
    ScrollArea,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Awaiting,
    SettingsInfoSkeleton,
    SettingsDialogProps,
    SettingsDialog,
} from "@marzneshin/components";
import {
    UserServicesTable,
    useUserUsageResetCmd,
    type UserType
} from "@marzneshin/features/users";
import { type FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    UserStatusEnableButton,
    SubscriptionActions,
    QRCodeSection,
    UserInfoTable
} from "./user-info";

interface UsersSettingsDialogProps extends SettingsDialogProps {
    entity: UserType | null;
    onClose: () => void;
    isPending: boolean;
}

export const UsersSettingsDialog: FC<UsersSettingsDialogProps> = ({
    onOpenChange,
    open,
    entity,
    onClose,
    isPending,
}) => {
    const { t } = useTranslation();
    const { mutate: resetUsage } = useUserUsageResetCmd();

    useEffect(() => {
        if (!open) onClose();
    }, [open, onClose]);

    return (
        <SettingsDialog open={open} onOpenChange={onOpenChange}>
            <Awaiting
                Component={entity ? (
                    <ScrollArea className="flex flex-col gap-4 h-full">
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
                                <UserInfoTable user={entity} />
                                <div className="hstack justify-center items-center gap-2">
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
                ) : (<div>Not Found</div>)}
                Skeleton={<SettingsInfoSkeleton />}
                isFetching={isPending}
            />
        </SettingsDialog>
    );
};
