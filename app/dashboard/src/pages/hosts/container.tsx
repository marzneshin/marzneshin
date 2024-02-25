import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { InboundsHostsFilters } from './filters'
import { InboundsSidebar } from './inbounds-sidebar'
import { HostsTable } from './table'

export const InboundsHostsManager = () => {
  return (
    <>
      <InboundsHostsFilters />
      <PanelGroup direction="horizontal">
        <Panel id="sidebar" minSize={20} order={1}>
          <InboundsSidebar />
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={60} order={2}>
          <HostsTable />
        </Panel>
      </PanelGroup>
    </>
  )
}
