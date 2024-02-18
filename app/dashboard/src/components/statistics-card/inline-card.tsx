import { StatisticsWidget } from './widget';
import { FC, PropsWithChildren } from 'react';
import { StatisticCardProps } from './statistics-props';

export const StatisticsCardInLine: FC<PropsWithChildren<StatisticCardProps>> = ({
  title,
  content,
  icon }) => {
  return (
    <StatisticsWidget
      title={title}
      icon={icon}
      content={content}
      display="flex"
      justifyContent="space-between"
      flexDirection="row"
    />
  );
};
