import {
  BoxProps,
  Button,
  chakra,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useDashboard, useInbounds } from 'stores';
import debounce from 'lodash.debounce';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

const iconProps = {
  baseStyle: {
    w: 4,
    h: 4,
  },
};

const SearchIcon = chakra(MagnifyingGlassIcon, iconProps);
const ClearIcon = chakra(XMarkIcon, iconProps);
export const ReloadIcon = chakra(ArrowPathIcon, iconProps);

export type FilterProps = {} & BoxProps;
const setSearchField = debounce((tag: string) => {
  useInbounds.getState().onInboundsFilterChange({
    ...useInbounds.getState().inboundsFilters,
    offset: 0,
    tag,
  });
}, 300);

export const InboundsHostsFilters: FC<FilterProps> = ({ ...props }) => {
  const { loading } = useDashboard();
  const {
    inboundsFilters: filters,
    onInboundsFilterChange,
    refetchHosts,
    onCreatingHost,
    selectedInbound,
  } = useInbounds();
  const toast = useToast();
  const onCreateClick = () => {
    if (selectedInbound) {
      onCreatingHost(true);
    } else {
      toast({
        title: t('hostsTable.inboundIsNotSelectedToCreate'),
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3000,
      });
    }
  }

  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchField(e.target.value);
  };
  const clear = () => {
    setSearch('');
    onInboundsFilterChange({
      ...filters,
      offset: 0,
      tag: '',
    });
  };

  return (
    <Grid
      id="hosts-filters"
      templateColumns={{
        lg: 'repeat(3, 1fr)',
        md: 'repeat(4, 1fr)',
        base: 'repeat(1, 1fr)',
      }}
      position="sticky"
      top={0}
      mx="-6"
      px="6"
      rowGap={4}
      gap={{
        lg: 4,
        base: 0,
      }}
      bg="var(--chakra-colors-chakra-body-bg)"
      py={4}
      zIndex="docked"
      {...props}
    >
      <GridItem colSpan={{ base: 1, md: 2, lg: 1 }} order={{ base: 2, md: 1 }}>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
          <Input
            placeholder={t('search')}
            value={search}
            borderColor="light-border"
            onChange={onChange}
          />
          <InputRightElement>
            {loading && <Spinner size="xs" />}
            {filters.tag && filters.tag.length > 0 && (
              <IconButton
                onClick={clear}
                aria-label="clear"
                size="xs"
                variant="ghost"
              >
                <ClearIcon />
              </IconButton>
            )}
          </InputRightElement>
        </InputGroup>
      </GridItem>
      <GridItem colSpan={2} order={{ base: 1, md: 2 }}>
        <HStack justifyContent="flex-end" alignItems="center" h="full">
          <IconButton
            aria-label="refresh name"
            disabled={loading}
            onClick={refetchHosts}
            size="sm"
            variant="outline"
          >
            <ReloadIcon
              className={classNames({
                'animate-spin': loading,
              })}
            />
          </IconButton>
          <Button
            colorScheme="primary"
            size="sm"
            onClick={() => onCreateClick()}
            px={5}
          >
            {t('hostsTable.createHosts')}
          </Button>
        </HStack>
      </GridItem>
    </Grid>
  );
};
