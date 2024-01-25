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
  const hoverStyle = {
    borderRadius: 4,
    border: '4px',
    m: '-2px',
    borderColor: 'primary.100',
  };
  const activeStyle = {
    bg: 'primary.500',
    ...hoverStyle,
  };
  const { t } = useTranslation();
  const { activePage, activatePage } = useDashboard();
  const [active, activate] = useState(index === activePage)

  useEffect(() => { activate(index === activePage) }, [active, activePage]);

  return (
    <ChakraLink as={ReactRouterLink} sx={active ? activeStyle : {}} to={path} w="13rem" _hover={hoverStyle} onClick={() => { activatePage(index) }}>
      <Flex flexDir="row" alignItems="center">
        <Icon color="primary.500">
          <ItemIcon color={active ? 'white' : 'primary.500'} />
        </Icon>
        <Text color={active ? 'white' : 'black'} fontSize="xl">{t(name)}</Text>
      </Flex>
    </ChakraLink>
  )
}

export const Sidebar = () => {

  return (
    <Flex
      pos="sticky"
      left="5"
      borderRightWidth="4px"
      borderRightColor="primary.100"
      borderRightStyle="solid"
      flexDir="column"
      h="100vh"
      bg="gray.50"
    >
      <VStack pt="30px" gap="6">
        <Image src="favicon/logo.svg" alt="marzneshin" boxSize="50px" />
        {pages.map((item: SideBarItemProps, index: number) =>
          <SidebarItem path={item.path} name={item.name} itemIcon={item.itemIcon} index={index} />)}
      </VStack>
    </Flex>
  )
}
