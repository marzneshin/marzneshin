import { HamburgerIcon } from '@chakra-ui/icons';
import { chakra, Flex } from '@chakra-ui/react'
import { pages } from 'constants/Pages';
import { FC } from 'react';
import { Logo } from './logo';
import { SidebarGroup } from './sidebar-group';
import { SidebarItem, SideBarItemProps } from './sidebar-item';

export const SidebarMenuIcon = chakra(HamburgerIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});


export const Sidebar: FC = () => {
  return (
    <aside>
      <Flex
        pos="sticky"
        borderRightWidth="4px"
        borderRightColor='gray.200'
        borderRightStyle="solid"
        flexDir="column"
        pt={4}
        h="100vh"
        bg="gray.50"
        _dark={{ bg: 'gray.800', borderRightColor: 'gray.700' }}
      >
        <Logo />
        <SidebarGroup titleT={'sidebar.groups.management'}>
          {pages.map((item: SideBarItemProps, index: number) =>
            <SidebarItem path={item.path} name={item.name} itemIcon={item.itemIcon} index={index} key={index} />)}
        </SidebarGroup>
      </Flex>
    </aside>
  )
}
