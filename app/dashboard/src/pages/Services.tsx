import { FC, useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { ServicesFilters } from 'components/ServicesFilters';
import { ServicesTable } from 'components/ServicesTable';
import { pages } from 'constants/Pages';
import { ServiceDialog } from 'components/ServiceDialog';
import { useServices } from 'contexts/ServicesContext';
import { useDashboard } from 'contexts/DashboardContext';


export const ServicesPage: FC = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/services'));
    useServices.getState().refetchServices();
  }, []);
  return (
    <VStack justifyContent="space-between" maxH="100vh" p="2rem" rowGap={4}>
      <Box w="full" >
        <ServiceDialog />
        {/* <DeleteServiceModal /> */}
        <ServicesFilters />
        <ServicesTable />
      </Box>
    </VStack>
  )
}
