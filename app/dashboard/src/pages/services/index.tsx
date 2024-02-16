
import { FC, useEffect } from 'react';
import { ServicesFilters } from 'components/ServicesFilters';
import { ServicesTable } from 'components/ServicesTable';
import { pages } from 'constants/Pages';
import { ServiceDialog } from 'components/service-dialog';
import { useServices } from 'contexts/ServicesContext';
import { useDashboard } from 'contexts/DashboardContext';
import { DeleteServiceModal } from 'components/DeleteServiceModal';
import Page from 'components/page';


const ServicesPage: FC = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/services'));
    useServices.getState().refetchServices();
  }, []);
  return (
    <Page>
      <ServiceDialog />
      <DeleteServiceModal />
      <ServicesFilters />
      <ServicesTable />
    </Page>
  )
}

export default ServicesPage;
