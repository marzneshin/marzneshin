import { Box, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

export const Page: FC<PropsWithChildren> = ({ children }) => {
  return (
    <VStack justifyContent="space-between" mt={4} rowGap={4}>
      <Box w="full">
        {children}
      </Box>
    </VStack>
  );
};

export default Page;
