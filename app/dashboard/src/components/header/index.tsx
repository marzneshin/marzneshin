import {
  Box,
  HStack,
  Text,
} from '@chakra-ui/react';
import { useDashboard } from 'stores';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from 'components/language';
import { ThemeToggle } from 'components/theme-toggler';

type HeaderProps = {
  actions?: ReactNode;
};

import { GithubMenuButton } from './github-button';
import { HeaderMenu } from './menu';

export const Header: FC<HeaderProps> = () => {
  const { activePage, } = useDashboard();
  const { t } = useTranslation();
  return (
    <HStack
      gap={2}
      justifyContent="space-between"
      __css={{
        '& .menuList': {
          direction: 'ltr',
        },
      }}
      bg='white'
      _dark={{ bg: 'dark-bg' }}
      p="6"
      borderBottom={'1px solid gray.600'}
      position="sticky"
      alignItems="center"
      zIndex={999}
      top={0}
    >
      <Text as="h1" fontWeight="bold" fontSize="2xl" m="0">
        {t(activePage.name)}
      </Text>
      <Box css={{ direction: 'ltr' }}>
        <HStack alignItems="center">
          <GithubMenuButton />
          <Language />
          <ThemeToggle />
          <HeaderMenu />
        </HStack>
      </Box>
    </HStack>
  );
};
