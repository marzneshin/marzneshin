
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  HStack,
  IconButton,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { ActionButtons } from './action-buttons';

import { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from 'components/status-badge';
import {
  Pagination,
  EmptySection,
  AccordionArrowIcon,
  EditIcon,
  Sort,
  StatusSortSelect,
  handleSort,
} from 'components/table';
import { useNodes } from 'stores';

type ExpandedIndex = number | number[];

type NodesTableProps = {} & TableProps;

export const NodesTable: FC<NodesTableProps> = (props) => {
  const {
    nodesFilters: filters,
    nodes,
    onEditingNode,
    onAddingNode,
    onFilterChange,
    refetchNodes,
  } = useNodes();

  const total = nodes.length;

  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<ExpandedIndex | undefined>(
    undefined
  );

  const useTable = useBreakpointValue({ base: false, md: true });

  // TODO: Find a different mechancism to to detect ftiler
  // const isFiltered = users.length !== total;

  const handleStatusFilter = (e: any) => {
    onFilterChange({
      status: e.target.value.length > 0 ? e.target.value : undefined,
    });
  };

  const toggleAccordion = (index: number) => {
    setSelectedRow(index === selectedRow ? undefined : index);
  };

  const StatusSortSelectNodes = () => (
    <StatusSortSelect
      filters={filters}
      options={['healthy', 'unhealthy', 'disabled']}
      handleStatusFilter={handleStatusFilter}
    />
  );

  refetchNodes();
  return (
    <Box id="node-table" overflowX={{ base: 'unset', md: 'unset' }} >
      <Accordion
        allowMultiple
        display={{ base: 'block', md: 'none' }}
        index={selectedRow}
      >
        <Table orientation="vertical" zIndex="docked" {...props}>
          <Thead zIndex="docked" position="relative">
            <Tr>
              <Th
                position="fixed"
                minW="120px"
                pl={4}
                pr={4}
                cursor={'pointer'}
                onClick={handleSort.bind(null, filters, 'name', onFilterChange)}
              >
                <HStack>
                  <span>{t('name')}</span>
                  <Sort sort={filters.sort} column="name" />
                </HStack>
              </Th>
              <Th
                position="fixed"
                minW="50px"
                pl={0}
                pr={0}
                w="140px"
                cursor={'pointer'}
              >
                <HStack spacing={0} position="relative">
                  <Text
                    position="absolute"
                    _dark={{
                      bg: 'gray.750',
                    }}
                    _light={{
                      bg: '#F9FAFB',
                    }}
                    userSelect="none"
                    pointerEvents="none"
                    zIndex={1}
                    w="100%"
                  >
                    {t('nodesTable.status')}
                    {filters.status ? ': ' + filters.status : ''}
                  </Text>
                  <StatusSortSelectNodes />
                </HStack>
              </Th>
              <Th
                position="fixed"
                minW="100px"
                cursor={'pointer'}
                pr={0}
                onClick={handleSort.bind(null, filters, 'xray_version', onFilterChange)}
              >
                <HStack>
                  <span>{t('nodesTable.xrayVersion')}</span>
                  <Sort sort={filters.sort} column="xray_version" />
                </HStack>
              </Th>
              <Th
                position="fixed"
                minW="100px"
                cursor={'pointer'}
                pr={0}
              >
                <span>{t('nodesTable.ipPort')}</span>
              </Th>
              {/* Action buttons (certificate, core settings)*/}
              <Th
                position="fixed"
                minW="32px"
                w="32px"
                p={0}
                cursor={'pointer'}
              ></Th>
            </Tr>
          </Thead>
          <Tbody>
            {!useTable &&
              nodes?.map((node, i) => {
                return (
                  <Fragment key={node.name}>
                    <Tr
                      onClick={toggleAccordion.bind(null, i)}
                      cursor="pointer"
                    >
                      <Td borderBottom={0} minW="100px" pl={4} pr={4}>
                        {node.name}
                      </Td>
                      <Td borderBottom={0} minW="50px" pl={0} pr={0}>
                        <StatusBadge
                          compact
                          showDetail={false}
                          status={node.status}
                        />
                      </Td>
                      <Td borderBottom={0} minW="100px" pr={0}>
                        {node.xray_version}
                      </Td>
                      <Td p={0} borderBottom={0} w="32px" minW="32px">
                        <AccordionArrowIcon
                          color="gray.600"
                          _dark={{
                            color: 'gray.400',
                          }}
                          transition="transform .2s ease-out"
                          transform={
                            selectedRow === i ? 'rotate(180deg)' : '0deg'
                          }
                        />
                      </Td>
                    </Tr>
                    <Tr
                      className="collapsible"
                      onClick={toggleAccordion.bind(null, i)}
                    >
                      <Td p={0} colSpan={4}>
                        <AccordionItem border={0}>
                          <AccordionButton display="none"></AccordionButton>
                          <AccordionPanel
                            border={0}
                            cursor="pointer"
                            px={6}
                            py={3}
                          >
                            <VStack justifyContent="space-between" spacing="4">
                              <VStack
                                alignItems="flex-start"
                                w="full"
                                spacing={-1}
                              >
                                <Text
                                  textTransform="capitalize"
                                  fontSize="xs"
                                  fontWeight="bold"
                                  color="gray.600"
                                  _dark={{
                                    color: 'gray.400',
                                  }}
                                >
                                  {t('nodesTable.ipPort')}
                                </Text>
                                <Box width="full" minW="230px">
                                  {node.address}:{node.port}
                                </Box>
                              </VStack>
                              <HStack w="full" justifyContent="space-between">
                                <HStack>
                                  <ActionButtons />
                                  <Tooltip
                                    label={t('nodesDialog.editNode')}
                                    placement="top"
                                  >
                                    <IconButton
                                      p="0 !important"
                                      aria-label="Edit user"
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditingNode(node);
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                </HStack>
                              </HStack>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      </Td>
                    </Tr>
                  </Fragment>
                );
              })}
          </Tbody>
        </Table>
      </Accordion>
      <Table
        orientation="vertical"
        display={{ base: 'none', md: 'table' }}
        {...props}
      >
        <Thead zIndex="docked" position="relative">
          <Tr>
            <Th
              minW="140px"
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'name', onFilterChange)}
            >
              <HStack>
                <span>{t('name')}</span>
                <Sort sort={filters.sort} column="name" />
              </HStack>
            </Th>
            <Th
              width="400px"
              minW="150px"
              cursor={'pointer'}
            >
              <HStack spacing={0} position="relative">
                <Text
                  position="absolute"
                  _dark={{
                    bg: 'gray.750',
                  }}
                  _light={{
                    bg: '#F9FAFB',
                  }}
                  userSelect="none"
                  pointerEvents="none"
                  zIndex={1}
                  w="100%"
                >
                  {t('nodesTable.status')}
                  {filters.status ? ': ' + filters.status : ''}
                </Text>
                <StatusSortSelectNodes />
              </HStack>
            </Th>
            <Th
              width="350px"
              minW="230px"
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'xray_version', onFilterChange)}
            >
              <HStack>
                <span>{t('nodesTable.xrayVersion')}</span>
                <Sort sort={filters.sort} column="xray_version" />
              </HStack>
            </Th>
            <Th
              width="350px"
              minW="230px"
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'address', onFilterChange)}
            >
              <HStack>
                <span>{t('nodesTable.ipPort')}</span>
                <Sort sort={filters.sort} column="address" />
              </HStack>
            </Th>
            <Th
              width="200px"
              minW="180px"
            />
          </Tr>
        </Thead>
        <Tbody overflowY="auto">
          {useTable &&
            nodes?.map((node, i) => {
              return (
                <Tr
                  key={node.name}
                  className={classNames('interactive', {
                    'last-row': i === nodes.length - 1,
                  })}
                  onClick={() => onEditingNode(node)}
                >
                  <Td minW="140px">
                    <div className="flex-status">
                      {node.name}
                    </div>
                  </Td>
                  <Td width="400px" minW="150px">
                    <StatusBadge
                      status={node.status}
                    />
                  </Td>
                  <Td width="350px" minW="150px">
                    {node.xray_version}
                  </Td>
                  <Td width="350px" minW="150px">
                    {node.address}:{node.port}
                  </Td>
                  <Td width="200px" minW="180px">
                    <ActionButtons />
                  </Td>
                </Tr>
              );
            })}
          {nodes.length == 0 && (
            <Tr>
              <Td colSpan={5}>
                <EmptySection
                  isFiltered={/* isFiltered */ false}
                  noObjectT="nodesTable.noNode"
                  noObjectMatchedT='nodesTable.noNodeMatched'
                  createObjectT="addNode"
                  onCreateObject={onAddingNode}
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Pagination filters={filters} total={total} onFilterChange={onFilterChange} />
    </Box>
  );
};
