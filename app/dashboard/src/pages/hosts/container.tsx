import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { InboundsSidebar } from './inbounds-sidebar'
import { HostsTable } from './table'

export const InboundsHostsManager = () => {
    return (
        <PanelGroup direction="horizontal">
            <Panel id="sidebar" minSize={10} order={1}>
                <InboundsSidebar />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={40} order={2}>
                <HostsTable />
            </Panel>
        </PanelGroup>
    )
}
