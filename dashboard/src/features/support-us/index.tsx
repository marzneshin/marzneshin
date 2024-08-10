import { type FC, type HTMLAttributes } from "react";
import { SupportUsVariation, SupportUsStructure } from "./types";
import { useSupportUs } from "./use-support-us";
import { SupportUsCard } from "./card";
import { SupportUsPopover } from "./popover";

export interface SupportUsProps extends HTMLAttributes<HTMLDivElement> {
    donationLink: string;
    open?: boolean;
    variant?: SupportUsVariation;
    structure?: SupportUsStructure;
}

export const SupportUs: FC<SupportUsProps> = ({ open = true, variant = "status", className, structure = "card", donationLink }) => {
    const [supportUsOpen, setSupportUsOpen] = useSupportUs(variant, open);

    if (!supportUsOpen) return null;
    return structure === "popover" ? (
        <SupportUsPopover
            className={className}
            donationLink={donationLink}
        />
    ) : (
        <SupportUsCard
            variant={variant}
            className={className}
            donationLink={donationLink}
            setSupportUsOpen={setSupportUsOpen}
        />
    );
};
