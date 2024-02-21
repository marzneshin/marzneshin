
import { FC, useEffect } from 'react';
import { CoreSettingsModal } from './modals/core-settings-modal';
import { NodesDialog } from './dialog';
import { NodesUsage } from './usage';
import { NodesTable } from './table';
import { NodesFilters } from './filters';
import { DeleteNodeModal } from './modals/delete-modal';
import { useNodes, useDashboard } from 'stores';
import { pages } from 'constants/Pages';
import Page from 'components/page';

const NodesPage: FC = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/nodes'));
    useNodes.getState().refetchNodes();
    useNodes.getState().refetchCertificate();
  }, []);
  return (
    <Page>
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
