
import {
  Accordion,
  Box,
  HStack,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react';

import classNames from 'classnames';
import { FC, useState, } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmptySection,
  handleSort,
  Pagination,
  Sort
} from 'components/table';
import { fetchServices, useServices } from 'stores';
import { pageSizeManagers } from 'utils/userPreferenceStorage';
import { useQuery } from 'react-query';
import { queryIds } from 'constants/query-ids';

type ExpandedIndex = number | number[];
type ServicesTableProps = {} & TableProps;

export const ServicesTable: FC<ServicesTableProps> = (props) => {
  const {
    servicesFilters: filters,
    onEditingService,
    onCreateService,
    onFilterChange,
  } = useServices();
  const { data: services } = useQuery(queryIds.services, () => { return fetchServices(filters) });
  const useTable = useBreakpointValue({ base: false, md: true });
  const { t } = useTranslation();
  const [selectedRow,] = useState<ExpandedIndex | undefined>(
    undefined
  );

  return (
    <Box id="services-table" h="45vh" overflowX={{ base: 'unset', md: 'unset' }} >
      <Accordion
        allowMultiple
        display={{ base: 'block', md: 'none' }}
        index={selectedRow}
      >
        <Table orientation="vertical" zIndex="docked" {...props}>
          <Thead zIndex="docked" position="relative">
            <Tr>
              <Tr>
                <Th
                  position="sticky"
                  minW="200px"
                  pl={4}
                  pr={4}
                  cursor={'pointer'}
                  onClick={handleSort.bind(null, filters, 'name', onFilterChange)}
                >
                  <HStack>
                    <span>{t('services')}</span>
                    <Sort sort={filters.sort} column="name" />
                  </HStack>
                </Th>
                <Th
                  position="sticky"
                  minW="50px"
                  cursor={'pointer'}
                  pr={0}
                  onClick={handleSort.bind(null, filters, 'users_number', onFilterChange)}
                >
                  <HStack>
                    <span>{t('servicesTable.usersNumber')}</span>
                    <Sort sort={filters.sort} column="users_number" />
                  </HStack>
                </Th>
                <Th
                  position="sticky"
                  minW="50px"
                  cursor={'pointer'}
                  pr={0}
                  onClick={handleSort.bind(null, filters, 'inbounds_number', onFilterChange)}
                >
                  <HStack>
                    <span>{t('servicesTable.inboundsNumber')}</span>
                    <Sort sort={filters.sort} column="inbounds_number" />
                  </HStack>
                </Th>
              </Tr>
            </Tr>
          </Thead>
          <Tbody>
            {!useTable &&
              services?.map((service, i) => {
                return (
                  <Tr
                    cursor="pointer"
                    key={service.id}
                    className={classNames('interactive', {
                      'last-row': i === (services.length - 1),
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditingService(service);
                    }}
                  >
                    <Td borderBottom={0} minW="100px" pl={4} pr={4}>
                      {service.name}
                    </Td>
                    <Td borderBottom={0} minW="50px" pl={6} pr={6}>
                      {service.users.length}
                    </Td>
                    <Td borderBottom={0} minW="50px" pr={0}>
                      {service.inbounds.length}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </Accordion>
      <Table orientation="vertical" zIndex="docked" {...props}>
        <Thead zIndex="docked" position="relative">
          <Tr>
            <Th
              position="sticky"
              minW="200px"
              pl={4}
              pr={4}
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'name', onFilterChange)}
            >
              <HStack>
                <span>{t('services')}</span>
                <Sort sort={filters.sort} column="name" />
              </HStack>
            </Th>
            <Th
              position="sticky"
              minW="50px"
              cursor={'pointer'}
              pr={0}
              onClick={handleSort.bind(null, filters, 'users_number', onFilterChange)}
            >
              <HStack>
                <span>{t('servicesTable.usersNumber')}</span>
                <Sort sort={filters.sort} column="users_number" />
              </HStack>
            </Th>
            <Th
              position="sticky"
              minW="50px"
              cursor={'pointer'}
              pr={0}
              onClick={handleSort.bind(null, filters, 'inbounds_number', onFilterChange)}
            >
              <HStack>
                <span>{t('servicesTable.inboundsNumber')}</span>
                <Sort sort={filters.sort} column="inbounds_number" />
              </HStack>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {useTable &&
            services?.map((service, i) => {
              return (
                <Tr
                  cursor="pointer"
                  key={service.id}
                  className={classNames('interactive', {
                    'last-row': i === (services.length - 1),
                  })}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditingService(service);
                  }}
                >
                  <Td borderBottom={0} minW="100px" pl={4} pr={4}>
                    {service.name}
                  </Td>
                  <Td borderBottom={0} minW="50px" pl={6} pr={6}>
                    {service.users.length}
                  </Td>
                  <Td borderBottom={0} minW="50px" pr={0}>
                    {service.inbounds.length}
                  </Td>
                </Tr>
              );
            })}
          {services?.length == 0 && (
            <Tr>
              <Td colSpan={3}>
                <EmptySection
                  isFiltered={false}
                  createObjectT='createService'
                  onCreateObject={onCreateService}
                  noObjectT="servicesTable.noService"
                  noObjectMatchedT='servicesTable.noServiceMatched'
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Pagination
        total={services?.length || 0}
        onFilterChange={onFilterChange}
        filters={filters}
        pageSizeManager={pageSizeManagers.services}
      />
    </Box>
  );
};
