import type { FC } from "react";
import { Badge, BadgeVariantKeys } from "@marzneshin/common/components";

interface BooleanPillProps {
    active: boolean;
    activeLabel: string;
    activeVariant?: BadgeVariantKeys;
    inactiveLabel: string;
    inactiveVariant?: BadgeVariantKeys;
}

export const BooleanPill: FC<BooleanPillProps> = ({
    active,
    activeLabel,
    inactiveLabel,
    activeVariant = "positive",
    inactiveVariant = "destructive"
}) => {
    return (
        <Badge variant={active ? activeVariant : inactiveVariant}>
            {active ? activeLabel : inactiveLabel}
        </Badge>
    )
}
