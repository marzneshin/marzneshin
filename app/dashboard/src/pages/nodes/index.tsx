
import { FC } from 'react';
import { CoreSettingsModal } from './modals/core-settings';
import { NodesDialog } from './dialog';
import { NodesUsage } from './usage';
import { NodesTable } from './table';
import { NodesFilters } from './filters';
import { DeleteNodeModal } from './modals/delete-modal';
import { pages } from 'stores';
import Page from 'components/page';

const NodesPage: FC = () => {
  return (
    <Page page={pages.nodes}>
      <NodesUsage />
      <NodesFilters />
      <NodesTable />
      <NodesDialog />
      <DeleteNodeModal />
      <CoreSettingsModal />
    </Page>
  );
}

export default NodesPage;
