import {
  SettingsDialogProps,
  SettingsDialog,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@marzneshin/common/components";
import { type FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ServicesUsersTable,
  ServiceInboundsTable,
  ServiceType,
} from "@marzneshin/modules/services";

interface ServicecSettingsDialogProps extends SettingsDialogProps {
  entity: ServiceType;
  onClose: () => void;
}

export const ServiceSettingsDialog: FC<ServicecSettingsDialogProps> = ({
  onOpenChange,
  open,
  entity,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <SettingsDialog open={open} onClose={onClose} onOpenChange={onOpenChange}>
      <Tabs className="my-3 w-full h-full" defaultValue="inbounds">
        <TabsList className="w-full">
          <TabsTrigger className="w-full" value="inbounds">
            {t("inbounds")}
          </TabsTrigger>
          <TabsTrigger className="w-full" value="users">
            {t("users")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inbounds" className="h-full">
          <ServiceInboundsTable service={entity} />
        </TabsContent>
        <TabsContent value="users" className="h-full">
          <ServicesUsersTable service={entity} />
        </TabsContent>
      </Tabs>
    </SettingsDialog>
  );
};
