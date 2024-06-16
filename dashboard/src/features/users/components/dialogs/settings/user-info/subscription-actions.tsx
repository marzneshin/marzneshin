import { Button, HStack } from "@marzneshin/components";
import { useTranslation } from "react-i18next";
import { getSubscriptionLink } from "@marzneshin/utils";
import { useUserSubscriptionRevokeCmd } from "@marzneshin/features/users";
import type { QRCodeProps } from "./qrcode";
import type { FC } from 'react';

import { SubscriptionLinkButton } from "./subcription-link-button";
export const SubscriptionActions: FC<QRCodeProps> = ({ entity }) => {
  const subscribeQrLink = getSubscriptionLink(entity.subscription_url);
  const { mutate: revokeSubscription } = useUserSubscriptionRevokeCmd();
  const { t } = useTranslation();
  return (
    <HStack className="w-full items-center">
      <SubscriptionLinkButton subscriptionLink={subscribeQrLink} />
      <Button className="w-full" onClick={() => revokeSubscription(entity)}>
        {t("page.users.revoke_subscription")}
      </Button>
    </HStack>
  );
};
