
import {
  Box,
  Button,
  chakra,
  HStack,
  Table,
  TableProps,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from '@chakra-ui/react';


import { ReactComponent as AddFileIcon } from 'assets/add_file.svg';
import classNames from 'classnames';
import { useDashboard } from 'contexts/DashboardContext';
import { t } from 'i18next';
import { FC, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination } from './Pagination';
import { SortType } from './UsersTable';
import { SortIcon } from './UsersTable/Icons';

const EmptySectionIcon = chakra(AddFileIcon);

export const Sort: FC<SortType> = ({ sort, column }) => {
  if (sort.includes(column))
    return (
      <SortIcon
        transform={sort.startsWith('-') ? undefined : 'rotate(180deg)'}
      />
    );
  return null;
};
type ServicesTableProps = {} & TableProps;

export const ServicesTable: FC<ServicesTableProps> = (props) => {
  const {
    servicesFilters: filters,
    services,
    onEditingService,
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
          {services ? services.map((service, i) => {
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
                <EmptySection isFiltered={false} />
              </Td>
            </Tr>
          }
        </Tbody>
      </Table>
      <Pagination total={services.length} onFilterChange={onFilterChange} filters={filters} />
    </Box>
  );
};

type EmptySectionProps = {
    isFiltered: boolean;
};

const EmptySection: FC<EmptySectionProps> = ({ isFiltered }) => {
  const { onCreateService } = useDashboard();
  return (
    <Box
      padding="5"
      py="8"
      display="flex"
      alignItems="center"
      flexDirection="column"
      gap={4}
      w="full"
    >
      <EmptySectionIcon
        maxHeight="200px"
        maxWidth="200px"
        _dark={{
          'path[fill="#fff"]': {
            fill: 'gray.800',
          },
          'path[fill="#f2f2f2"], path[fill="#e6e6e6"], path[fill="#ccc"]': {
            fill: 'gray.700',
          },
          'circle[fill="#3182CE"]': {
            fill: 'primary.300',
          },
        }}
        _light={{
          'path[fill="#f2f2f2"], path[fill="#e6e6e6"], path[fill="#ccc"]': {
            fill: 'gray.300',
          },
          'circle[fill="#3182CE"]': {
            fill: 'primary.500',
          },
        }}
      />
      <Text fontWeight="medium" color="gray.600" _dark={{ color: 'gray.400' }}>
        {isFiltered ? t('servicesTable.noServiceMatched') : t('servicesTable.noService')}
      </Text>
      {!isFiltered && (
        <Button
          size="sm"
          colorScheme="primary"
          onClick={() => onCreateService(true)}
        >
          {t('createService')}
        </Button>
      )}
    </Box>
  );
};
