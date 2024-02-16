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
  Tooltip,
} from '@chakra-ui/react';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useDashboard } from 'contexts/DashboardContext';
import { useNodes } from 'contexts/NodesContext';
import debounce from 'lodash.debounce';
import React, { FC, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { CopiedIcon, SubscriptionLinkIcon } from './Table/Icons';

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
const setSearchField = debounce((name: string) => {
  useNodes.getState().onFilterChange({
    ...useNodes.getState().nodesFilters,
    offset: 0,
    name,
  });
}, 300);

export const NodesFilters: FC<FilterProps> = ({ ...props }) => {
  const { loading } = useDashboard();
  const { nodesFilters: filters, onFilterChange, refetchNodes, onAddingNode: onAddNodes } = useNodes();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchField(e.target.value);
  };
  const clear = () => {
    setSearch('');
    onFilterChange({
      ...filters,
      offset: 0,
      name: '',
    });
  };
  const { certificate } = useNodes();

  const [copied, setCopied] = useState([-1, false]);
  useEffect(() => {
    if (copied[1]) {
      setTimeout(() => {
        setCopied([-1, false]);
      }, 1000);
    }
  }, [copied]);

  return (
    <Grid
      id="nodes-filters"
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
            {filters.name && filters.name.length > 0 && (
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
            onClick={refetchNodes}
            size="sm"
            variant="outline"
          >
            <ReloadIcon
              className={classNames({
                'animate-spin': loading,
              })}
            />
          </IconButton>
          <CopyToClipboard
            text={
              certificate
            }
            onCopy={() => {
              setCopied([0, true]);
            }}
          >
            <div>
              <Tooltip
                label={
                  copied[0] == 0 && copied[1]
                    ? t('nodesTable.copied')
                    : t('nodesTable.copyCertificate')
                }
                placement="top"
              >
                <IconButton
                  p="0 !important"
                  aria-label="copy certificate"
                  bg="transparent"
                  _dark={{
                    _hover: {
                      bg: 'gray.700',
                    },
                  }}
                  size={{
                    base: 'sm',
                    md: 'md',
                  }}
                >
                  {copied[0] == 0 && copied[1] ? (
                    <CopiedIcon />
                  ) : (
                    <SubscriptionLinkIcon />
                  )}
                </IconButton>
              </Tooltip>
            </div>
          </CopyToClipboard>
          <Button
            colorScheme="primary"
            size="sm"
            onClick={() => onAddNodes(true)}
            px={5}
          >
            {t('nodesTable.addNode')}
          </Button>
        </HStack>
      </GridItem>
    </Grid>
  );
};
