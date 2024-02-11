import { Box, VStack } from '@chakra-ui/react';
import { FC } from 'react';
import { Statistics } from '../components/Statistics';

export const Dashboard: FC = () => {
  return (
    <VStack justifyContent="space-between" p="6" rowGap={4}>
      <Box w="full">
        <Statistics mt="4" />
      </Box>
    </VStack>
  );
};

export default Dashboard;
