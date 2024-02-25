
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
import { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pagination,
    EmptySection,
    AccordionArrowIcon,
    EditIcon,
    Sort,
    handleSort,
} from 'components/table';
import { useInbounds, fetchInboundHosts } from 'stores';
import { useQuery } from 'react-query';
import { pageSizeManagers } from 'utils/userPreferenceStorage';

type ExpandedIndex = number | number[];

type NodesTableProps = {} & TableProps;

export const HostsTable: FC<NodesTableProps> = (props) => {
    const {
        hostsFilters: filters,
        selectedInbound,
        onEditingHost,
        onCreatingHost,
        onFilterChange,
    } = useInbounds();

    const { data: hosts } = useQuery('hosts', () => {
        if (selectedInbound !== null) {

            return fetchInboundHosts(selectedInbound.id);
        }
    });

    const { t } = useTranslation();
    const [selectedRow, setSelectedRow] = useState<ExpandedIndex | undefined>(
        undefined
    );

    const useTable = useBreakpointValue({ base: false, md: true });

    // TODO: Find a different mechancism to to detect ftiler
    // const isFiltered = users.length !== total;
    const toggleAccordion = (index: number) => {
        setSelectedRow(index === selectedRow ? undefined : index);
    };

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
                                minW="120px"
                                pl={4}
                                pr={4}
                                cursor={'pointer'}
                                onClick={handleSort.bind(null, filters, 'remark', onFilterChange)}
                            >
                                <HStack>
                                    <span>{t('remark')}</span>
                                    <Sort sort={filters.sort} column="remark" />
                                </HStack>
                            </Th>
                            <Th
                                minW="100px"
                                cursor={'pointer'}
                                pr={0}
                                onClick={handleSort.bind(null, filters, 'address', onFilterChange)}
                            >
                                <HStack>
                                    <span>{t('hostsTable.address')}</span>
                                    <Sort sort={filters.sort} column="address" />
                                </HStack>
                            </Th>
                            <Th
                                minW="100px"
                                cursor={'pointer'}
                                pr={0}
                                onClick={handleSort.bind(null, filters, 'port', onFilterChange)}
                            >
                                <HStack>
                                    <span>{t('hostsTable.port')}</span>
                                    <Sort sort={filters.sort} column="port" />
                                </HStack>
                            </Th>
                            {/* Action buttons (certificate, core settings)*/}
                            <Th
                                minW="32px"
                                w="32px"
                                p={0}
                                cursor={'pointer'}
                            ></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {!useTable && hosts?.map((host, i) => {
                            return (
                                <Fragment key={i}>
                                    <Tr
                                        onClick={toggleAccordion.bind(null, i)}
                                        cursor="pointer"
                                    >
                                        <Td borderBottom={0} minW="100px" pl={4} pr={4}>
                                            {host.remark}
                                        </Td>
                                        <Td borderBottom={0} minW="100px" pr={0}>
                                            {host.address}
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
                                                                {host.port}
                                                            </Box>
                                                        </VStack>
                                                        <HStack w="full" justifyContent="space-between">
                                                            <HStack>
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
                                                                            onEditingHost(true, host);
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
                            minW="120px"
                            pl={4}
                            pr={4}
                            cursor={'pointer'}
                            onClick={handleSort.bind(null, filters, 'remark', onFilterChange)}
                        >
                            <HStack>
                                <span>{t('remark')}</span>
                                <Sort sort={filters.sort} column="remark" />
                            </HStack>
                        </Th>
                        <Th
                            minW="100px"
                            cursor={'pointer'}
                            pr={0}
                            onClick={handleSort.bind(null, filters, 'address', onFilterChange)}
                        >
                            <HStack>
                                <span>{t('hostsTable.address')}</span>
                                <Sort sort={filters.sort} column="address" />
                            </HStack>
                        </Th>
                        <Th
                            minW="100px"
                            cursor={'pointer'}
                            pr={0}
                            onClick={handleSort.bind(null, filters, 'port', onFilterChange)}
                        >
                            <HStack>
                                <span>{t('hostsTable.port')}</span>
                                <Sort sort={filters.sort} column="port" />
                            </HStack>
                        </Th>
                        {/* Action buttons (certificate, core settings)*/}
                    </Tr>
                </Thead>
                <Tbody overflowY="auto">
                    {useTable && hosts?.map((host, i) => {
                        return (
                            <Tr
                                key={i}
                                className={classNames('interactive', {
                                    'last-row': i === hosts.length - 1,
                                })}
                                onClick={() => onEditingHost(true, host)}
                            >
                                <Td minW="140px">
                                    <div className="flex-status">
                                        {host.remark}
                                    </div>
                                </Td>
                                <Td width="400px" minW="150px">
                                    {host.address}
                                </Td>
                                <Td width="350px" minW="150px">
                                    {host.port}
                                </Td>
                                <Td width="350px" minW="150px">
                                    {host.port}
                                </Td>
                            </Tr>
                        );
                    })}
                    {(hosts?.length === 0 || hosts === undefined) && (
                        <Tr>
                            <Td colSpan={5}>
                                <EmptySection
                                    isFiltered={/* isFiltered */ false}
                                    noObjectT="hostsTable.noHost"
                                    noObjectMatchedT='hostsTable.noHostMatched'
                                    createObjectT="addNode"
                                    onCreateObject={onCreatingHost}
                                />
                            </Td>
                        </Tr>
                    )}
                </Tbody>
            </Table>
            <Pagination filters={filters} total={hosts === undefined ? 0 : hosts.length} onFilterChange={onFilterChange} pageSizeManager={pageSizeManagers.hosts} />
        </Box>
    );
};
