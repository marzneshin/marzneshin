import { useTranslation } from "react-i18next";
import { Button } from "@marzneshin/components";
import type { FC } from "react";

export const DonationButton: FC<{ donationLink: string }> = ({ donationLink }) => {
    const { t } = useTranslation();
    return (
        <Button size="sm" variant="secondary" className="w-fit" asChild>
            <a
                href={donationLink}
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('support-us.donate')}
            </a>
        </Button>
    )
}
