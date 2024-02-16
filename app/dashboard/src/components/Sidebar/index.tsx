import { HamburgerIcon } from '@chakra-ui/icons';
import { chakra, Image, Flex, VStack, Text } from '@chakra-ui/react'
import { useDashboard } from 'contexts/DashboardContext';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import { pages } from 'constants/Pages';
import { PageType } from 'types/Page';
import { Icon } from 'components/Icon';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export type SideBarItemProps = Pick<
  PageType,
  | 'name'
  | 'path'
  | 'itemIcon'
>

export const SidebarMenuIcon = chakra(HamburgerIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export const SidebarItem: FC<SideBarItemProps & { index: number }> = ({ itemIcon: ItemIcon, name, path, index, }) => {
  const { t } = useTranslation();
  const { activePage, activatePage } = useDashboard();
  const [active, activate] = useState(index === activePage)

  useEffect(() => { activate(index === activePage) }, [active, activePage]);

  const darkStyle = { bg: active ? 'primary.900' : 'transparent' };
  const hoverStyle = {
    borderRadius: 10,
    bg: active ? undefined : 'gray.200',
    _dark: {
      bg: 'gray.700'
    },
    transition: 'background-color 0.9s',
  };

  return (
    <ChakraLink
      as={ReactRouterLink}
      borderRadius={10}
      bg={active ? 'primary.500' : 'transparent'}
      border="4px"
      ps="4px"
      borderColor="transparent"
      _dark={darkStyle}
      to={path}
      w="13rem"
      _hover={hoverStyle}
      onClick={() => {
        activatePage(index);
      }}
    >
      <Flex flexDir="row" alignItems="center" >
        <Icon color="">
          <ItemIcon color={active ? 'gray.100' : undefined} _dark={{ color: active ? 'gray.100' : undefined }} />
        </Icon>
        <Text color={active ? 'gray.100' : 'gray.700'} _dark={{ color: 'gray.100' }} fontSize="xl" >
          {t(name)}
        </Text>
      </Flex>
    </ChakraLink>
  );
}

export const Sidebar = () => {
  return (
    <aside>
      <Flex
        pos="sticky"
        left="5"
        borderRightWidth="4px"
        borderRightColor='gray.200'
        borderRightStyle="solid"
        flexDir="column"
        h="100vh"
        bg="gray.50"
        _dark={{ bg: 'gray.800', borderRightColor: 'gray.700' }}
      >
        <VStack pt="30px" gap="2">
          <Image src="favicon/logo.svg" alt="marzneshin" boxSize="50px" />
          {pages.map((item: SideBarItemProps, index: number) =>
            <SidebarItem path={item.path} name={item.name} itemIcon={item.itemIcon} index={index} key={index} />)}
        </VStack>
      </Flex>
    </aside>
  )
}
