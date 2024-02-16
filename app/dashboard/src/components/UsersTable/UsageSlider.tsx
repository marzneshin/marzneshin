import { HStack, Text, SliderTrack, SliderFilledTrack, Slider, SliderProps } from '@chakra-ui/react';
import { resetStrategy } from 'constants/Settings';
import { formatBytes } from 'utils/formatByte';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';

export const UsageSliderCompact: FC<UsageSliderProps> = (props) => {
  const { used, total } = props;
  const isUnlimited = total === 0 || total === null;
  return (
    <HStack
      justifyContent="space-between"
      fontSize="xs"
      fontWeight="medium"
      color="gray.600"
      _dark={{
        color: 'gray.400',
      }}
    >
      <Text>
        {formatBytes(used)} /{' '}
        {isUnlimited ? (
          <Text as="span" fontFamily="system-ui">
            ∞
          </Text>
        ) : (
          formatBytes(total)
        )}
      </Text>
    </HStack>
  );
};

type UsageSliderProps = {
  used: number;
  total: number | null;
  dataLimitResetStrategy: string | null;
  totalUsedTraffic: number;
} & SliderProps;

const getResetStrategy = (strategy: string): string => {
  for (var i = 0; i < resetStrategy.length; i++) {
    const entry = resetStrategy[i];
    if (entry.value == strategy) {
      return entry.title;
    }
  }
  return 'No';
};

export const UsageSlider: FC<UsageSliderProps> = (props) => {
  const {
    used,
    total,
    dataLimitResetStrategy,
    totalUsedTraffic,
    ...restOfProps
  } = props;
  const isUnlimited = total === 0 || total === null;
  const isReached = !isUnlimited && (used / total) * 100 >= 100;
  const { t } = useTranslation();
  return (
    <>
      <Slider
        orientation="horizontal"
        value={isUnlimited ? 100 : Math.min((used / total) * 100, 100)}
        colorScheme={isReached ? 'red' : 'primary'}
        {...restOfProps}
      >
        <SliderTrack h="6px" borderRadius="full">
          <SliderFilledTrack borderRadius="full" />
        </SliderTrack>
      </Slider>
      <HStack
        justifyContent="space-between"
        fontSize="xs"
        fontWeight="medium"
        color="gray.600"
        _dark={{
          color: 'gray.400',
        }}
      >
        <Text>
          {formatBytes(used)} /{' '}
          {isUnlimited ? (
            <Text as="span" fontFamily="system-ui">
              ∞
            </Text>
          ) : (
            formatBytes(total) +
            (dataLimitResetStrategy && dataLimitResetStrategy !== 'no_reset'
              ? ' ' +
              t(
                'userDialog.resetStrategy' +
                getResetStrategy(dataLimitResetStrategy)
              )
              : '')
          )}
        </Text>
        <Text>
          {t('usersTable.total')}: {formatBytes(totalUsedTraffic)}
        </Text>
      </HStack>
    </>
  );
};
