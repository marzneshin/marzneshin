import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@marzneshin/components";
import { NodeConfigEditor } from "./node-config-editor";
import { LogContainer } from "../../log";
import { useTranslation } from "react-i18next";
import type { NodeType } from "../..";
import type { FC } from "react";

export const NodeBackendSetting: FC<{ node: NodeType; backend: string }> = ({
  node,
  backend,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-2 h-1/2 flex flex-col gap-2">
        <Tabs className="my-3 w-full h-full" defaultValue="logs">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="logs">
              {t("logs")}
            </TabsTrigger>
            <TabsTrigger className="w-full" value="config">
              {t("config")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="logs" className="h-full w-full">
            <LogContainer node={node} backend={backend} />
          </TabsContent>
          <TabsContent value="config" className="h-full z-51">
            <NodeConfigEditor entity={node} backend={backend} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
