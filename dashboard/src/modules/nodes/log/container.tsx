import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  ScrollArea,
  Separator,
} from "@marzneshin/common/components";
import type { NodeType } from "..";
import { useNodesLog } from "..";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface LogContainerProps {
  node: NodeType;
  backend: string;
}

export const LogContainer: FC<LogContainerProps> = ({ node, backend }) => {
  const { logs, status, logsDiv } = useNodesLog(node, backend);
  const { t } = useTranslation();

  return (
    <Card className="h-full w-full">
      <CardContent className="flex flex-col p-2 h-full w-full">
        <CardHeader className="flex flex-row justify-between items-center p-2">
          <p className="capitalize font-header">{`${backend} ${t("logs")}`}</p>
          <div className="flex flex-row gap-2 justify-center items-center">
            <Badge
              className="capitalize"
              variant={status === "closed" ? "destructive" : "positive"}
            >
              {status}
            </Badge>
          </div>
        </CardHeader>
        <ScrollArea
          className="flex p-2 h-full max-h-[calc(100vh-20rem)] rounded-md bg-secondary text-primary w-full overflow-auto"
          ref={logsDiv}
        >
          {logs.map((log: string, index: number) => (
            <div key={log} className="w-full">
              <p className="font-mono text-[0.7rem] text-primary my-1 break-all rounded-sm p-[1px] hover:bg-gray-300 dark:hover:bg-gray-900">
                {log}
              </p>
              {index !== logs.length - 1 && (
                <Separator className="bg-white dark:bg-gray-700" />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
