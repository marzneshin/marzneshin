import { Badge, Text } from '@chakra-ui/react';

import { statusColors } from 'constants/Settings';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Status as StatusType } from 'types';
import { relativeExpiryDate } from 'utils/dateFormatter';

type StatusProps = {
  expiryDate?: number | null;
  status: StatusType;
  compact?: boolean;
  showDetail?: boolean;
  extraText?: string | null;
};
export const StatusBadge: FC<StatusProps> = ({
  expiryDate,
  status,
  compact = false,
  showDetail = true,
  extraText,
}) => {
  const { t } = useTranslation();
  const dateInfo = relativeExpiryDate(expiryDate);
  const Icon = statusColors[status].icon;
  return (
    <>
      <Badge
        colorScheme={statusColors[status].statusColor}
        rounded="full"
        display="inline-flex"
        px={3}
        py={1}
        columnGap={compact ? 1 : 2}
        alignItems="center"
      >
        <Icon w={compact ? 3 : 4} />
        {showDetail && (
          <Text
            textTransform="capitalize"
            fontSize={compact ? '.7rem' : '.875rem'}
            lineHeight={compact ? '1rem' : '1.25rem'}
            fontWeight="medium"
            letterSpacing="tighter"
          >
            {status}
            {extraText && `: ${extraText}`}
          </Text>
        )}
      </Badge>
      {showDetail && expiryDate && (
        <Text
          display="inline-block"
          fontSize="xs"
          fontWeight="medium"
          ml="2"
          color="gray.600"
          _dark={{
            color: 'gray.400',
          }}
        >
          {t(dateInfo.status, { time: dateInfo.time })}
        </Text>
      )}
    </>
  );
};
