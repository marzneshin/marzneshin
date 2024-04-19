
import {
    useUserSubscriptionRevokeCmd,
    UserType
} from '@marzneshin/features/users';
import QRCode from "react-qr-code";
import { QrCodeIcon } from "lucide-react";
import { FC } from 'react'
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@marzneshin/components';
import { useTranslation } from 'react-i18next';
import { SubscriptionLinkButton } from './subcription-link-button';
import { getSubscriptionLink } from '@marzneshin/utils';

interface QRCodeProps {
    entity: UserType
}

export const QRCodeSection: FC<QRCodeProps> = (
    { entity }
) => {
    const subscribeQrLink = getSubscriptionLink(entity.subscription_url);
    const { mutate: revokeSubscription } = useUserSubscriptionRevokeCmd()
    const { t } = useTranslation()
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center w-full">
                <CardTitle className="flex flex-row gap-4 justify-start">
                    <QrCodeIcon />
                    {t('subscription')}
                </CardTitle>
                <Button className="w-[9rem]" onClick={() => revokeSubscription(entity)}>
                    {t('page.users.revoke_subscription')}
                </Button>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center py-10 w-full h-full'>
                <div className="flex flex-col gap-3 justify-center items-center w-1/2 h-1/2">
                    <QRCode
                        size={150}
                        className="w-full h-full"
                        value={subscribeQrLink}
                    />
                    <SubscriptionLinkButton subscriptionLink={subscribeQrLink} />
                </div>
            </CardContent>
        </Card>
    );
}
