import { Box, VStack } from '@chakra-ui/react';
import { HostsDialog } from 'components/HostsDialog';

export const HostPage = () => {
  return (
    <VStack justifyContent="space-between" p="6" rowGap={4} >
      <Box w="full" >
        <HostsDialog />
      </Box>
    </VStack >
  )
}
