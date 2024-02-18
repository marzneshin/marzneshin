import {
  Box,
  CircularProgress,
  VStack,
  chakra,
  useColorMode,
} from '@chakra-ui/react';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import { FilterUsageType } from 'types/Filter';
import { useNodes } from 'contexts/NodesContext';
import dayjs from 'dayjs';
import { FC, Suspense, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';
import { Icon } from 'components/icon';
import { UsageFilter, createUsageConfig } from 'components/UsageFilter';
import { StatisticsCardWide } from 'components/statistics-card';

const UsageIcon = chakra(ChartPieIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export type NodesUsageProps = {};

export const NodesUsage: FC<NodesUsageProps> = () => {
  const { isShowingNodesUsage } = useNodes();
  const { fetchNodesUsage } = useNodes();
  const { t } = useTranslation();
  const { colorMode } = useColorMode();

  const usageTitle = t('userDialog.total');
  const [usage, setUsage] = useState(createUsageConfig(colorMode, usageTitle));
  const [usageFilter, setUsageFilter] = useState('1m');
  const fetchUsageWithFilter = (query: FilterUsageType) => {
    fetchNodesUsage(query).then((data: any) => {
      const labels = [];
      const series = [];
      for (const key in data.usages) {
        const entry = data.usages[key];
        series.push(entry.uplink + entry.downlink);
        labels.push(entry.node_name);
      }
      setUsage(createUsageConfig(colorMode, usageTitle, series, labels));
    });
  };

  useEffect(() => {
    if (isShowingNodesUsage) {
      fetchUsageWithFilter({
        start: dayjs().utc().subtract(30, 'day').format('YYYY-MM-DDTHH:00:00'),
      });
    }
  }, [isShowingNodesUsage]);

  return (
    <StatisticsCardWide
      title={t('header.nodesUsage')}
      icon={<Icon color="primary">
        <UsageIcon color="white" /> </Icon>}
      content={
        <VStack gap={4}>
          <UsageFilter
            defaultValue={usageFilter}
            onChange={(filter, query) => {
              setUsageFilter(filter);
              fetchUsageWithFilter(query);
            }}
          />
          <Box justifySelf="center" w="full" maxW="300px" mt="4">
            <Suspense fallback={<CircularProgress isIndeterminate />}>
              <ReactApexChart
                options={usage.options}
                series={usage.series}
                type="donut"
                height="500px"
              />
            </Suspense>
          </Box>
        </VStack>

      } />
  );
};
