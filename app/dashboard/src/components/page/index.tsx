
import { Box, VStack } from '@chakra-ui/react';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { FC, PropsWithChildren } from 'react';

export const Page: FC<PropsWithChildren> = ({ children }) => {
  return (
    <VStack justifyContent="space-between" p="6" rowGap={4}>
      <Box w="full">
        <Header />
        {children}
        <Footer />
      </Box>
    </VStack>
  );
};

export default Page;
