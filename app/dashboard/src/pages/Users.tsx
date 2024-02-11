
import { ResetAllUsageModal } from 'components/ResetAllUsageModal';
import { Box, VStack } from '@chakra-ui/react';
import { DeleteUserModal } from 'components/DeleteUserModal';
import { UserDialog } from 'components/UserDialog';
import { UsersTable } from 'components/UsersTable/';
import { useDashboard } from 'contexts/DashboardContext';
import { useEffect } from 'react';
import { UsersFilters } from 'components/UsersFilters';
import { QRCodeDialog } from 'components/QRCodeDialog';
import { ResetUserUsageModal } from 'components/ResetUserUsageModal';
import { RevokeSubscriptionModal } from 'components/RevokeSubscriptionModal';
import { pages } from 'constants/Pages';
import { useUsers } from 'contexts/UsersContext';


export const UsersPage = () => {
  useEffect(() => {
    useDashboard.getState().activatePage(pages.findIndex((page) => page.path === '/users'));
    useUsers.getState().refetchUsers();
  }, []);
  return (
    <VStack justifyContent="space-between" maxH="100vh" p="2rem" rowGap={4}>
      <Box w="full" >
        <UsersFilters />
        <UsersTable />
        <UserDialog />
        <QRCodeDialog />
        <DeleteUserModal />
        <RevokeSubscriptionModal />
        <ResetAllUsageModal />
        <ResetUserUsageModal />
      </Box>
    </VStack>
  )
}
