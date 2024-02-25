
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
import { statusColors } from 'constants/Settings';
import { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnlineBadge } from 'components/online-badge';
import { OnlineStatus } from 'components/online-status';
import { StatusBadge } from 'components/status-badge';
import {
  Pagination,
  EmptySection,
  AccordionArrowIcon,
  handleSort,
  EditIcon,
  StatusSortSelect,
  Sort,
} from 'components/table';
import { UsageSlider, UsageSliderCompact } from './usage-slider';
import { useUsers } from 'stores';
import { ActionButtons } from './action-buttons';
import { pageSizeManagers } from 'utils/userPreferenceStorage';

type ExpandedIndex = number | number[];

type UsersTableProps = {} & TableProps;

export const UsersTable: FC<UsersTableProps> = (props) => {
  const {
    usersFilters: filters,
    users: { users },
    users: { total },
    onEditingUser,
    onCreateUser,
    onFilterChange,
  } = useUsers();

  const { t } = useTranslation();
  const [selectedRow, setSelectedRow] = useState<ExpandedIndex | undefined>(
    undefined
  );
  const useTable = useBreakpointValue({ base: false, md: true });

  const isFiltered = users.length !== total;

  const handleStatusFilter = (e: any) => {
    onFilterChange({
      status: e.target.value.length > 0 ? e.target.value : undefined,
    });
  };

  const toggleAccordion = (index: number) => {
    setSelectedRow(index === selectedRow ? undefined : index);
  };
  return (
    <Box id="users-table" overflowX={{ base: 'unset', md: 'unset' }}>
      <Accordion
        allowMultiple
        display={{ base: 'block', md: 'none' }}
        index={selectedRow}
      >
        <Table orientation="vertical" zIndex="docked" {...props}>
          <Thead zIndex="docked" position="relative">
            <Tr>
              <Th
                position="sticky"
                minW="120px"
                pl={4}
                pr={4}
                cursor={'pointer'}
                onClick={handleSort.bind(null, filters, 'username', onFilterChange)}
              >
                <HStack>
                  <span>{t('users')}</span>
                  <Sort sort={filters.sort} column="username" />
                </HStack>
              </Th>
              <Th
                position="sticky"
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
                    {t('usersTable.status')}
                    {filters.status ? ': ' + filters.status : ''}
                  </Text>
                  <StatusSortSelect filters={filters} handleStatusFilter={handleStatusFilter} options={['active', 'disabled', 'limited', 'expired', 'on_hold']} />
                </HStack>
              </Th>
              <Th
                position="sticky"
                minW="100px"
                cursor={'pointer'}
                pr={0}
                onClick={handleSort.bind(null, filters, 'used_traffic', onFilterChange)}
              >
                <HStack>
                  <span>{t('usersTable.dataUsage')}</span>
                  <Sort sort={filters.sort} column="used_traffic" />
                </HStack>
              </Th>
              <Th
                position="sticky"
                minW="32px"
                w="32px"
                p={0}
                cursor={'pointer'}
              ></Th>
            </Tr>
          </Thead>
          <Tbody>
            {!useTable &&
              users?.map((user, i) => {
                return (
                  <Fragment key={user.username}>
                    <Tr
                      onClick={toggleAccordion.bind(null, i)}
                      cursor="pointer"
                    >
                      <Td borderBottom={0} minW="100px" pl={4} pr={4}>
                        <div className="flex-status">
                          <OnlineBadge lastOnline={user.online_at} />
                          {user.username}
                        </div>
                      </Td>
                      <Td borderBottom={0} minW="50px" pl={0} pr={0}>
                        <StatusBadge
                          compact
                          showDetail={false}
                          expiryDate={user.expire}
                          status={user.status}
                        />
                      </Td>
                      <Td borderBottom={0} minW="100px" pr={0}>
                        <UsageSliderCompact
                          totalUsedTraffic={user.lifetime_used_traffic}
                          dataLimitResetStrategy={
                            user.data_limit_reset_strategy
                          }
                          used={user.used_traffic}
                          total={user.data_limit}
                          colorScheme={statusColors[user.status].bandWidthColor}
                        />
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
                                  {t('usersTable.dataUsage')}
                                </Text>
                                <Box width="full" minW="230px">
                                  <UsageSlider
                                    totalUsedTraffic={
                                      user.lifetime_used_traffic
                                    }
                                    dataLimitResetStrategy={
                                      user.data_limit_reset_strategy
                                    }
                                    used={user.used_traffic}
                                    total={user.data_limit}
                                    colorScheme={
                                      statusColors[user.status].bandWidthColor
                                    }
                                  />
                                </Box>
                              </VStack>
                              <HStack w="full" justifyContent="space-between">
                                <Box width="full">
                                  <StatusBadge
                                    compact
                                    expiryDate={user.expire}
                                    status={user.status}
                                  />
                                  <OnlineStatus lastOnline={user.online_at} />
                                </Box>
                                <HStack>
                                  <ActionButtons user={user} />
                                  <Tooltip
                                    label={t('userDialog.editUser')}
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
                                        onEditingUser(user);
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
              position="sticky"
              minW="140px"
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'username', onFilterChange)}
            >
              <HStack>
                <span>{t('username')}</span>
                <Sort sort={filters.sort} column="username" />
              </HStack>
            </Th>
            <Th
              position="sticky"
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
                  {t('usersTable.status')}
                  {filters.status ? ': ' + filters.status : ''}
                </Text>
                <StatusSortSelect filters={filters} handleStatusFilter={handleStatusFilter} options={['active', 'disabled', 'limited', 'expired', 'on_hold']} />
              </HStack>
            </Th>
            <Th
              position="sticky"
              width="350px"
              minW="230px"
              cursor={'pointer'}
              onClick={handleSort.bind(null, filters, 'used_traffic', onFilterChange)}
            >
              <HStack>
                <span>{t('usersTable.dataUsage')}</span>
                <Sort sort={filters.sort} column="used_traffic" />
              </HStack>
            </Th>
            <Th
              position="sticky"
              width="200px"
              minW="180px"
            />
          </Tr>
        </Thead>
        <Tbody>
          {useTable &&
            users?.map((user, i) => {
              return (
                <Tr
                  key={user.username}
                  className={classNames('interactive', {
                    'last-row': i === users.length - 1,
                  })}
                  onClick={() => onEditingUser(user)}
                >
                  <Td minW="140px">
                    <div className="flex-status">
                      <OnlineBadge lastOnline={user.online_at} />
                      {user.username}
                      <OnlineStatus lastOnline={user.online_at} />
                    </div>
                  </Td>
                  <Td width="400px" minW="150px">
                    <StatusBadge
                      expiryDate={user.expire}
                      status={user.status}
                    />
                  </Td>
                  <Td width="350px" minW="230px">
                    <UsageSlider
                      totalUsedTraffic={user.lifetime_used_traffic}
                      dataLimitResetStrategy={user.data_limit_reset_strategy}
                      used={user.used_traffic}
                      total={user.data_limit}
                      colorScheme={statusColors[user.status].bandWidthColor}
                    />
                  </Td>
                  <Td width="200px" minW="180px">
                    <ActionButtons user={user} />
                  </Td>
                </Tr>
              );
            })}
          {users.length == 0 && (
            <Tr>
              <Td colSpan={4}>
                <EmptySection
                  isFiltered={isFiltered}
                  noObjectT="usersTable.noUser"
                  noObjectMatchedT='usersTable.noUserMatched'
                  createObjectT="createUser"
                  onCreateObject={onCreateUser}
                />
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
      <Pagination filters={filters} total={total} onFilterChange={onFilterChange} pageSizeManager={pageSizeManagers.users} />
    </Box>
  );
};
