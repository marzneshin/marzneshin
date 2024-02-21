import { UserDialog } from './dialog';
import { UsersTable } from './table';
import { useUsers, useDashboard } from 'stores';
import { useEffect } from 'react';
import { UsersFilters } from './filters';
import {
  ResetAllUsageModal,
  DeleteUserModal,
  QRCodeDialog,
  ResetUserUsageModal,
  RevokeSubscriptionModal
} from './modals';
import { pages } from 'constants/Pages';
import Page from 'components/page';


const UsersPage = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/users'));
    useUsers.getState().refetchUsers();
  }, []);
  return (
    <Page>
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
