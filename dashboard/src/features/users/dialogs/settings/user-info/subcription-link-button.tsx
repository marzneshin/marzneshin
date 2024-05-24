import { useTranslation } from "react-i18next";
import { CopyToClipboardButton } from "@marzneshin/components";
import type { FC } from "react";
import { SquareCode } from "lucide-react";
import { getSubscriptionLink } from "@marzneshin/utils";

interface SubscriptionLinkButtonProps {
  subscriptionLink: string;
}

export const SubscriptionLinkButton: FC<SubscriptionLinkButtonProps> = ({
  subscriptionLink,
}) => {
  const { t } = useTranslation();

  return (
    <CopyToClipboardButton
      text={getSubscriptionLink(subscriptionLink)}
      successMessage={t("page.users.settings.subscription_link.copied")}
      copyLabel={t("page.users.settings.subscription_link.copy")}
      errorLabel={t("page.users.settings.subscription_link.error")}
      copyIcon={SquareCode}
      className="w-full"
    />
  );
};
