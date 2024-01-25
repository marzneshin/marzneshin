
import { FC } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { CoreSettingsModal } from 'components/CoreSettingsModal';
import { NodesDialog } from 'components/NodesModal';
import { NodesUsage } from 'components/NodesUsage';

export const NodesPage: FC = () => {
  return (
    <VStack justifyContent="space-between" p="6" rowGap={4}>
      <Box>
        <NodesDialog />
        <NodesUsage />
        <CoreSettingsModal />
      </Box>
    </VStack>
  )
}
