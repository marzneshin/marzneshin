
import { FC, useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { CoreSettingsModal } from 'components/CoreSettingsModal';
import { NodesDialog } from 'components/NodesModal';
import { NodesUsage } from 'components/NodesUsage';
import { NodesTable } from 'components/NodesTable';
import { NodesFilters } from 'components/NodesFilters';
import { useDashboard } from 'contexts/DashboardContext';
import { useNodes } from 'contexts/NodesContext';
import { pages } from 'constants/Pages';

export const NodesPage: FC = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/nodes'));
    useNodes.getState().refetchNodes();
    useNodes.getState().refetchCertificate();
  }, []);
  return (
    <VStack justifyContent="space-between" p="6" rowGap={4}>
      <Box w="full">
        <NodesFilters />
        <NodesTable />
        <NodesDialog />
        {/* <DeleteNodesModal /> */}
        <NodesUsage />
        <CoreSettingsModal />
      </Box>
    </VStack>
  )
}
