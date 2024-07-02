import type { FC } from "react";
import { Badge } from "@marzneshin/components";

interface BooleanPillProps {
    active: boolean;
    activeLabel: string;
    inactiveLabel: string;
}

export const BooleanPill: FC<BooleanPillProps> = ({ active, activeLabel, inactiveLabel }) => {
    return (
        <Badge variant={active ? "positive" : "destructive"}>
            {active ? activeLabel : inactiveLabel}
        </Badge>
    )
}
