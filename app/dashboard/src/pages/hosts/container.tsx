import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { InboundsHostsFilters } from './filters'
import { InboundsSidebar } from './inbounds-sidebar'
import { HostsTable } from './table'
import { queryIds } from 'constants/query-ids';
import { useQuery } from '@tanstack/react-query';
import { fetchInbounds, fetchInboundHosts, useInbounds } from 'stores';

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
      <PanelGroup direction="horizontal">
        <Panel id="sidebar" minSize={20} order={1}>
          <InboundsSidebar inbounds={inbounds} />
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={60} order={2}>
          <HostsTable hosts={hosts} />
        </Panel>
      </PanelGroup>
    </>
  )
}
