import { HostsDialog } from './dialog';
import Page from 'components/page';
import { pages } from 'stores';
import { InboundsHostsManager } from './container';

const HostsPage = () => {
  return (
    <Page page={pages.hosts}>
      <HostsDialog />
      <InboundsHostsManager />
    </Page>
  )
}

export default HostsPage;
