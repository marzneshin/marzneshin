
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
  useBreakpointValue,
} from '@chakra-ui/react';

import classNames from 'classnames';
import { useDashboard } from 'contexts/DashboardContext';
import { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptySection } from 'components/Table/EmptySection';
import { Pagination } from 'components/Pagination';
import { Sort } from 'components/Table/Sort';

type ServicesTableProps = {} & TableProps;

export const ServicesTable: FC<ServicesTableProps> = (props) => {
  const {
    servicesFilters: filters,
    services,
    onEditingService,
    onCreateService,
    onFilterChange,
  } = useDashboard();

  const { t } = useTranslation();
  const marginTop = useBreakpointValue({ base: 120, lg: 72 }) || 72;
  const [top, setTop] = useState(`${marginTop}px`);

  useEffect(() => {
    const calcTop = () => {
      const el = document.querySelectorAll('#filters')[0] as HTMLElement;
      setTop(`${el.offsetHeight}px`);
    };
    window.addEventListener('scroll', calcTop);
    () => window.removeEventListener('scroll', calcTop);
  }, []);

  const handleSort = (column: string) => {
    let newSort = filters.sort;
    if (newSort.includes(column)) {
      if (newSort.startsWith('-')) {
        newSort = '-created_at';
      } else {
        newSort = '-' + column;
      }
    } else {
      newSort = column;
    }
    onFilterChange({
      sort: newSort,
    });
  };

  return (
    <Box id="services-table" overflowX={{ base: 'unset', md: 'unset' }} >
      <Table orientation="vertical" zIndex="docked" {...props}>
        <Thead zIndex="docked" position="relative">
          <Tr>
            <Th
              position="sticky"
              top={top}
              minW="100px"
              pl={4}
              pr={4}
              cursor={'pointer'}
              onClick={handleSort.bind(null, 'name')}
            >
              <HStack>
                <span>{t('services')}</span>
                <Sort sort={filters.sort} column="name" />
              </HStack>
            </Th>
            <Th
              position="sticky"
              top={top}
              minW="50px"
              cursor={'pointer'}
              pr={0}
              onClick={handleSort.bind(null, 'users_number')}
            >
              <HStack>
                <span>{t('servicesTable.usersNumber')}</span>
                <Sort sort={filters.sort} column="users_number" />
              </HStack>
            </Th>
            <Th
              position="sticky"
              top={top}
              minW="50px"
              cursor={'pointer'}
              pr={0}
              onClick={handleSort.bind(null, 'inbounds_number')}
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
      <Pagination />
    </Box>
  );
};
