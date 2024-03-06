import { InboundsHostsFilters } from './filters'
import { InboundsSidebar } from './inbounds-sidebar'
import { HostsTable } from './table'
import { queryIds } from 'constants/query-ids';
import { useQuery } from '@tanstack/react-query';
import { fetchInbounds, fetchInboundHosts, useInbounds } from 'stores';
import { Grid, GridItem, } from '@chakra-ui/react';

export const InboundsHostsManager = () => {
  const { selectedInbound } = useInbounds();

  const { data: inbounds } = useQuery({
    queryKey: [queryIds.inbounds],
    initialData: [],
    queryFn: () => {
      return fetchInbounds();
    }
  });

  const { data: hosts } = useQuery({
    queryKey: [queryIds.hosts, selectedInbound?.id],
    initialData: [],
    queryFn: () => {
      return fetchInboundHosts(selectedInbound?.id);
    }
  });

  return (
    <>
      <InboundsHostsFilters />
      <Grid
        templateColumns='repeat(4, 1fr)'
        gap="3"
        h="10rem"
      >
        <GridItem colSpan={1}>
          <InboundsSidebar inbounds={inbounds} />
        </GridItem>
        <GridItem colSpan={3}>
          <HostsTable hosts={hosts} />
        </GridItem>
      </Grid>
    </>
  )
}
