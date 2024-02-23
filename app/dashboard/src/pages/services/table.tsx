
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
import { FC, Fragment, } from 'react';
import { useTranslation } from 'react-i18next';
import {
  EmptySection,
  handleSort,
  Pagination,
  Sort
} from 'components/table';
import { useServices } from 'stores';

type ServicesTableProps = {} & TableProps;

export const ServicesTable: FC<ServicesTableProps> = (props) => {
  const {
    servicesFilters: filters,
    services,
    onEditingService,
    onCreateService,
    onFilterChange,
    refetchServices,
  } = useServices();

  const { t } = useTranslation();

  refetchServices();
  return (
    <Box id="services-table" h="45vh" overflowX={{ base: 'unset', md: 'unset' }} >
      <Table orientation="vertical" zIndex="docked" {...props}>
        <Thead zIndex="docked" position="relative">
          <Tr>
            <Th
              position="sticky"
              minW="100px"
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
          {services.length !== 0 ? services.map((service, i) => {
            return (
              <Fragment key={service.name}>
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
              </Fragment>
            );
          }) :
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
          }
        </Tbody>
      </Table>
      <Pagination total={services.length} onFilterChange={onFilterChange} filters={filters} />
    </Box>
  );
};
