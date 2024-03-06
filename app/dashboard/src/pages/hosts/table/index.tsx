import {
  Box,
  HStack,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { FC, useEffect, } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmptySection,
  Sort,
  handleSort,
} from 'components/table';
import { useInbounds, HostType } from 'stores';


type NodesTableProps = {
  hosts: HostType[];
} & TableProps;

export const HostsTable: FC<NodesTableProps> = ({ hosts }) => {
  const {
    hostsFilters: filters,
    selectedInbound,
    refetchHosts,
    onHostsFilterChange,
    onEditingHost,
  } = useInbounds();

  useEffect(() => {
    refetchHosts();
  }, [selectedInbound]);

  const { t } = useTranslation();

  return (
    <Box id="hosts-table" borderTopStartRadius="0" overflowX={{ base: 'unset', md: 'unset' }} >
      <Table
        orientation="vertical"
      >
        <Thead zIndex="docked" position="relative">
          <Tr>
            <Th
              minW="120px"
              pl={4}
              pr={4}
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'remark', onHostsFilterChange)}
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
              onClick={handleSort.bind(null, filters, 'address', onHostsFilterChange)}
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
              onClick={handleSort.bind(null, filters, 'port', onHostsFilterChange)}
            >
              <HStack>
                <span>{t('hostsTable.port')}</span>
                <Sort sort={filters.sort} column="port" />
              </HStack>
            </Th>
          </Tr>
        </Thead>
        <Tbody overflowY="auto">
          {hosts?.map((host, i) => {
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
                  createObjectT="hostsTable.createHosts"
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      {/* TODO:
        * <Pagination filters={filters} total={hosts === undefined ? 0 : hosts.length} onHostsFilterChange={onFilterChange} pageSizeManager={pageSizeManagers.hosts} /> 
        */}
    </Box>
  );
};
