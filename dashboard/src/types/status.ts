import { BadgeVariantKeys } from "@marzneshin/components";
import { LucideIcon } from "lucide-react";

export interface StatusType {
    label: string;
    icon: LucideIcon | null;
    variant?: BadgeVariantKeys | undefined
}
