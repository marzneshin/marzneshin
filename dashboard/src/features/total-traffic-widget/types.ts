import { UserType } from "@marzneshin/modules/users";

export interface NodesUsage {
    datetime: Date;
    nodes: Record<string, number>;
}

export interface UserNodesUsageWidgetProps {
    user: UserType;
}

export type ChartDateInterval = '90d' | '30d' | '7d' | '1d';
