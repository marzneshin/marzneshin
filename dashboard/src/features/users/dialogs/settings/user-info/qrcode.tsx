
import { UserType } from '@marzneshin/features/users';
import QRCode from "react-qr-code";
import { QrCodeIcon } from "lucide-react";
import { FC } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@marzneshin/components';
import { useTranslation } from 'react-i18next';

interface QRCodeProps {
    entity: UserType
}

export const QRCodeSection: FC<QRCodeProps> = (
    { entity }
) => {
    const subscribeQrLink = String(entity.subscription_url).startsWith('/')
        ? window.location.origin + entity.subscription_url
        : String(entity.subscription_url);
    const { t } = useTranslation()
    return (
        <Card >
            <CardHeader>
                <CardTitle className="flex flex-row gap-4 justify-start">
                    <QrCodeIcon />
                    {t('subscription')}
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col justify-center items-center py-10'>
                <QRCode
                    size={150}
                    className="w-1/2 h-1/2"
                    value={subscribeQrLink}
                    viewBox={`0 0 256 256`}
                />
                <div>

                </div>
            </CardContent>
        </Card>
    );
}
