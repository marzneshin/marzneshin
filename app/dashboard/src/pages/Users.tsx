
import { ResetAllUsageModal } from 'components/ResetAllUsageModal';
import { Box, VStack } from '@chakra-ui/react';
import { DeleteUserModal } from 'components/DeleteUserModal';
import { UserDialog } from 'components/UserDialog';
import { UsersTable } from 'components/UsersTable';
import { useDashboard } from 'contexts/DashboardContext';
import { useEffect } from 'react';
import { Filters } from 'components/Filters';
import { QRCodeDialog } from 'components/QRCodeDialog';
import { ResetUserUsageModal } from 'components/ResetUserUsageModal';
import { RevokeSubscriptionModal } from 'components/RevokeSubscriptionModal';


export const UsersPage = () => {
  useEffect(() => {
    useDashboard.getState().refetchUsers();
  }, []);
  return (
    <VStack justifyContent="space-between" maxH="100vh" p="2rem" rowGap={4}>
      <Box w="full" >
        <Filters />
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
