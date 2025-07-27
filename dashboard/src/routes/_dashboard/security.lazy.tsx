import { Page } from '@marzneshin/common/components';
import { Admin2FASetup } from '@marzneshin/modules/profile/Admin2FASetup';
import { createLazyFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const SecurityPage = () => {
  const { t } = useTranslation();
  return (
    <Page
      title={t('Security Settings')}
      className="flex flex-col gap-3"
    >
      <Admin2FASetup />
    </Page>
  );
};

export const Route = createLazyFileRoute('/_dashboard/security')({
  component: SecurityPage,
});