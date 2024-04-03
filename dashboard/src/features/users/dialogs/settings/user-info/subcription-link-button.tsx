import { useTranslation } from 'react-i18next';
import { CopyToClipboardButton } from '@marzneshin/components';
import { FC } from 'react';
import { SquareCode } from 'lucide-react';

interface SubscriptionLinkButtonProps {
    subscriptionLink: string;
}

export const SubscriptionLinkButton: FC<SubscriptionLinkButtonProps> = ({ subscriptionLink }) => {
    const { t } = useTranslation();

    return (
        <CopyToClipboardButton
            text={subscriptionLink}
            successMessage={t('page.users.settings.subscription_link.copied')}
            copyLabel={t('page.users.settings.subscription_link.copy')}
            errorLabel={t('page.users.settings.subscription_link.error')}
            copyIcon={SquareCode}
        />
    );
};
