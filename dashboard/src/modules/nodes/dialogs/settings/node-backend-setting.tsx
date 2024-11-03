import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@marzneshin/common/components";
import { NodeConfigEditor } from "./node-config-editor";
import { LogContainer } from "../../log";
import { useTranslation } from "react-i18next";
import { type NodeType, useBackendStatsQuery } from "../..";
import type { FC } from "react";

export const NodeBackendSetting: FC<{ node: NodeType; backend: string }> = ({
  node,
  backend,
}) => {
  const { t } = useTranslation();
  const nodeBackend = node.backends.find((item) => item.name === backend);
  const { data: backendStats } = useBackendStatsQuery(node, backend);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center  gap-2 w-full">
        <CardTitle className="capitalize">{backend}</CardTitle>
        {nodeBackend?.version && (
          <Badge className="size-fit">v{nodeBackend.version}</Badge>
        )}
        {backendStats === null ? (
          <Badge variant="disabled" className="size-fit">
            {t("unknown")}
          </Badge>
        ) : backendStats.running ? (
          <Badge variant="positive" className="size-fit">
            {t("running")}
          </Badge>
        ) : (
          <Badge variant="destructive" className="size-fit">
            {t("down")}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-2 w-full h-1/2 flex flex-col gap-2">
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
