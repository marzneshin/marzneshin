import { BoxProps, chakra, HStack, Text } from '@chakra-ui/react';
import {
  ChartBarIcon,
  ChartPieIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useDashboard } from 'stores';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetch } from 'service/http';
import { formatBytes, numberWithCommas } from 'utils/formatByte';
import { useEffect } from 'react';
import { StatisticsCardInLine, StatisticsQueryKey } from 'components/statistics-card';

const TotalUsersIcon = chakra(UsersIcon, {
  baseStyle: {
    w: 5,
    h: 5,
    position: 'relative',
    zIndex: '2',
  },
});

const NetworkIcon = chakra(ChartBarIcon, {
  baseStyle: {
    w: 5,
    h: 5,
    position: 'relative',
    zIndex: '2',
  },
});

const MemoryIcon = chakra(ChartPieIcon, {
  baseStyle: {
    w: 5,
    h: 5,
    position: 'relative',
    zIndex: '2',
  },
});


export const Statistics: FC<BoxProps> = (props) => {
  const { version: currentVersion } = useDashboard();
  const { data: systemData } = useQuery({
    queryKey: [StatisticsQueryKey],
    queryFn: () => fetch('/system'),
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (systemData?.version !== currentVersion && systemData !== undefined)
      useDashboard.setState({ version: systemData.version })
  }, [systemData]);

  const { t } = useTranslation();
  return (
    <HStack
      justifyContent="space-between"
      gap={0}
      columnGap={{ lg: 4, md: 0 }}
      rowGap={{ lg: 0, base: 4 }}
      display="flex"
      flexDirection={{ lg: 'row', base: 'column' }}
      {...props}
    >
      <StatisticsCardInLine
        title={t('activeUsers')}
        content={
          systemData && (
            <HStack alignItems="flex-end">
              <Text>{numberWithCommas(systemData.users_active)}</Text>
              <Text
                fontWeight="normal"
                fontSize="lg"
                as="span"
                display="inline-block"
                pb="5px"
              >
                / {numberWithCommas(systemData.total_user)}
              </Text>
            </HStack>
          )
        }
        icon={<TotalUsersIcon />}
      />
      <StatisticsCardInLine
        title={t('dataUsage')}
        content={
          systemData &&
          formatBytes(
            systemData.incoming_bandwidth + systemData.outgoing_bandwidth
          )
        }
        icon={<NetworkIcon />}
      />
      <StatisticsCardInLine
        title={t('memoryUsage')}
        content={
          systemData && (
            <HStack alignItems="flex-end">
              <Text>{formatBytes(systemData.mem_used, 1, true)[0]}</Text>
              <Text
                fontWeight="normal"
                fontSize="lg"
                as="span"
                display="inline-block"
                pb="5px"
              >
                {formatBytes(systemData.mem_used, 1, true)[1]} /{' '}
                {formatBytes(systemData.mem_total, 1)}
              </Text>
            </HStack>
          )
        }
        icon={<MemoryIcon />}
      />
    </HStack>
  );
};
