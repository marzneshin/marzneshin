import { UserDialog } from './dialog';
import { UsersTable } from './table';
import { UsersFilters } from './filters';
import {
  ResetAllUsageModal,
  DeleteUserModal,
  QRCodeDialog,
  ResetUserUsageModal,
  RevokeSubscriptionModal
} from './modals';
import { pages } from 'stores';
import Page from 'components/page';

const UsersPage = () => {
  return (
    <Page page={pages.users}>
      <UsersFilters />
      <UsersTable />
      <UserDialog />
      <QRCodeDialog />
      <DeleteUserModal />
      <RevokeSubscriptionModal />
      <ResetAllUsageModal />
      <ResetUserUsageModal />
    </Page>
  )
}

export default UsersPage;
