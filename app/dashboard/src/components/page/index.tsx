import { Box, VStack } from '@chakra-ui/react';
import { FC, PropsWithChildren, useEffect } from 'react';
import { useDashboard } from 'stores';
import { PageType } from 'types';

const usePage = (page: PageType) => {
  useEffect(() => {
    useDashboard.getState().activatePage(page);
  }, []);
};

type PageProp = {
  page: PageType;
}

export const Page: FC<PropsWithChildren<PageProp>> = ({ page, children }) => {
  usePage(page);

  return (
    <VStack justifyContent="space-between" mt={4} rowGap={4}>
      <Box w="full">
        {children}
      </Box>
    </VStack>
  );
};

export default Page;
