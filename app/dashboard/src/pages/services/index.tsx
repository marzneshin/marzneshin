
import { FC } from 'react';
import { ServicesFilters } from './filters';
import { ServicesTable } from './table';
import { pages } from 'stores';
import { ServiceDialog } from './dialog';
import { DeleteServiceModal } from './modals/delete-modal';
import Page from 'components/page';


const ServicesPage: FC = () => {
  return (
    <Page page={pages.services}>
      <ServiceDialog />
      <DeleteServiceModal />
      <ServicesFilters />
      <ServicesTable />
    </Page>
  )
}

export default ServicesPage;
