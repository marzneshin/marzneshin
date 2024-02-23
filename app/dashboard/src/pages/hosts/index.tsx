import { HostsDialog } from './dialog';
import Page from 'components/page';
import { pages } from 'stores';

const HostsPage = () => {
  return (
    <Page page={pages.hosts}>
      <HostsDialog />
    </Page>
  )
}

export default HostsPage;
