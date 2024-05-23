import {
  Card,
  CardContent,
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
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import type { NodeType } from "../..";
import { LogContainer } from "../../log";
import { NodesDetailTable } from "../../tables/detail-table";
import { NodeConfigEditor } from "./node-config-editor";

interface NodesSettingsDialogProps {
  onOpenChange: (state: boolean) => void;
  open: boolean;
  entity: NodeType;
}

export const NodesSettingsDialog: FC<NodesSettingsDialogProps> = ({
  onOpenChange,
  open,
  entity,
}) => {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:min-w-full md:min-w-[600px] ">
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>{t("page.nodes.settings.title")}</SheetTitle>
          </SheetHeader>
          <div className="my-4">
            <h1 className="font-medium font-header">
              {t("page.nodes.settings.detail")}
            </h1>
            <NodesDetailTable node={entity} />
          </div>
          <Tabs className="my-3 w-full h-full" defaultValue="logs">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="logs">
                {t("logs")}
              </TabsTrigger>
              <TabsTrigger className="w-full" value="config">
                {t("config")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="logs" className="h-full">
              <LogContainer node={entity} />
            </TabsContent>
            <TabsContent value="config" className="h-full z-51">
              <Card>
                <CardContent className="p-2 h-1/2 flex flex-col gap-2">
                  <NodeConfigEditor entity={entity} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
