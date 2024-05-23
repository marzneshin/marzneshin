import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  ScrollArea,
  Separator,
} from "@marzneshin/components";
import type { NodeType } from "..";
import { useNodesLog } from "..";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface LogContainerProps {
  node: NodeType;
}

export const LogContainer: FC<LogContainerProps> = ({ node }) => {
  const { logs, status, logsDiv } = useNodesLog(node);
  const { t } = useTranslation();
  return (
    <Card className="h-1/2">
      <CardContent className="flex flex-col p-1 h-full">
        <CardHeader className="flex flex-row justify-between items-center p-2">
          <p className="capitalize font-header">
            {t("page.nodes.settings.log-container.title")}
          </p>
          <div className="flex flex-row gap-2 justify-center items-center">
            <Badge
              variant={status === "closed" ? "destructive" : "default"}
              className="flex justify-center items-center w-full h-6 capitalize"
            >
              {status}
            </Badge>
          </div>
        </CardHeader>
        <ScrollArea
          className="flex p-2 m-1 h-full rounded-md divide-dashed divide-accent bg-secondary text-primary max-w-full"
          ref={logsDiv}
        >
          {logs.map((log: string) => {
            return (
              <div key={log}>
                <p className="font-mono text-[0.7rem] text-primary m-1">{log}</p>
                <Separator className="bg-gray-600" />
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
