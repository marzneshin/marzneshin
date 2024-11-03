import { BadgeVariantKeys } from "@marzneshin/common/components";
import { LucideIcon } from "lucide-react";

export interface StatusType {
    label: string;
    icon: LucideIcon | null;
    variant?: BadgeVariantKeys | undefined
}
