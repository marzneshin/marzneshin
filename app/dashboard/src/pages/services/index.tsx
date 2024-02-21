
import { FC, useEffect } from 'react';
import { ServicesFilters } from './filters';
import { ServicesTable } from './table';
import { pages } from 'constants/Pages';
import { ServiceDialog } from './dialog';
import { useDashboard, useServices } from 'stores';
import { DeleteServiceModal } from './modals/delete-modal';
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
