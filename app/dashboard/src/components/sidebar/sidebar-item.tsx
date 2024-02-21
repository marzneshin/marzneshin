
import { Flex, Text } from '@chakra-ui/react'
import { useDashboard } from 'stores';
import { Link as ReactRouterLink } from 'react-router-dom'
import { Link as ChakraLink } from '@chakra-ui/react'
import { Icon } from 'components/icon';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageType } from 'types';

export type SideBarItemProps = Pick<
  PageType,
  | 'name'
  | 'path'
  | 'itemIcon'
>

export const SidebarItem: FC<SideBarItemProps & { index: number }> = ({ itemIcon: ItemIcon, name, path, index }) => {
  const { t } = useTranslation();
  const { activePage, activatePage, isCollapsed } = useDashboard();
  const [active, activate] = useState(index === activePage);

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
      // ps="4px"
      borderColor="transparent"
      _dark={darkStyle}
      to={path}
      w="85%"
      _hover={hoverStyle}
      onClick={() => {
        activatePage(index);
      }}
    >
      <Flex flexDir="row" alignItems="center" justifyContent={isCollapsed ? 'center' : undefined} >
        <Icon color="">
          <ItemIcon color={active ? 'gray.100' : undefined} _dark={{ color: active ? 'gray.100' : undefined }} />
        </Icon>
        <Text
          color={active ? 'gray.100' : 'gray.700'}
          _dark={{ color: 'gray.100' }} fontSize="xl"
          display={isCollapsed ? 'none' : 'block'}>
          {t(name)}
        </Text>
      </Flex>
    </ChakraLink>
  );
}
