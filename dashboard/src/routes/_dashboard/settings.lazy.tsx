import { Page, VStack } from '@marzneshin/common/components';
import { CertificateWidget } from '@marzneshin/modules/settings';
import { SubscriptionSettingsWidget } from '@marzneshin/modules/settings/subscription';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { SudoRoute } from '@marzneshin/libs/sudo-routes';

// --- 1. ADD THE IMPORT FOR THE NEW COMPONENT ---
import { Admin2FASetup } from '../../modules/profile/Admin2FASetup';

export const Settings = () => {
  const { t } = useTranslation();
  return (
    <Page
      title={t('settings')}
      className="sm:flex flex-col lg:grid grid-cols-2 gap-3 h-full"
    >
      <VStack className="gap-3">
        {/* --- 2. ADD THE 2FA COMPONENT HERE --- */}
        <Admin2FASetup />
        {/* ------------------------------------ */}

        <SubscriptionSettingsWidget />
        <CertificateWidget />
      </VStack>
      {/* <ConfigurationWidget /> */}
    </Page>
  );
};

export const Route = createLazyFileRoute('/_dashboard/settings')({
  component: () => (
    <SudoRoute>
      {' '}
      <Settings />{' '}
    </SudoRoute>
  ),
});