import { Box } from '@chakra-ui/react';
import { PanelGroup, Panel, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';
import { Footer } from 'components/Footer';
import { Header } from 'components/header';
import { Sidebar } from 'components/sidebar';
import { Suspense, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { useDashboard } from 'contexts/DashboardContext';

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
        <Box overflowY="auto" p="6" >
          <Header />
          <Box >
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
