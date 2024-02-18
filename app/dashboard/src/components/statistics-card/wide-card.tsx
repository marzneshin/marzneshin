import { StatisticsWidget } from './widget';
import { FC, PropsWithChildren } from 'react';
import { StatisticCardProps } from './statistics-props';

export const StatisticsCardWide: FC<PropsWithChildren<StatisticCardProps>> = ({
  title,
  content,
  icon }) => {
  return (
    <StatisticsWidget
      title={title}
      icon={icon}
      content={content}
      flexDirection="column"
    />
  );
};
