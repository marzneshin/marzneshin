import { FC, useEffect } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { ServicesFilters } from 'components/ServicesFilters';
import { ServicesTable } from 'components/ServicesTable';
import { useDashboard } from 'contexts/DashboardContext';
import { pages } from 'constants/Pages';


export const ServicesPage: FC = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/services'));
    useDashboard.getState().refetchServices();
  }, []);
  return (
    <VStack justifyContent="space-between" maxH="100vh" p="2rem" rowGap={4}>
      <Box w="full" >
        <ServicesFilters />
        <ServicesTable />
        {/* <ServiceDialog /> */}
        {/* <DeleteServiceModal /> */}
      </Box>
    </VStack>
  )
}
