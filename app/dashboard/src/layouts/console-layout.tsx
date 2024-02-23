import { Box } from '@chakra-ui/react';
import { PanelGroup, Panel, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { Footer } from 'components/footer';
import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';
import { Suspense, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useDashboard } from 'stores';

export const ConsoleLayout = () => {
  const ref = useRef<ImperativePanelHandle>(null);
  const { collapseSidebar, expandSidebar } = useDashboard();

  return (
    <PanelGroup autoSaveId="sidebar-ratio" direction="horizontal">
      <Panel collapsible onExpand={expandSidebar} onCollapse={collapseSidebar} collapsedSize={5} defaultSize={20} maxSize={20} minSize={10} ref={ref}>
        <Sidebar />
      </Panel>
      <PanelResizeHandle />
      <Panel minSize={30} >
        <Box overflowY="auto" h="100vh" >
          <Header />
          <Box p="6">
            <Suspense>
              <Outlet />
            </Suspense>
            <Footer />
          </Box>
        </Box>
      </Panel>
    </PanelGroup>
  );
};

export default ConsoleLayout;
