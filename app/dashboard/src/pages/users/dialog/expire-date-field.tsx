import {
  FormControl,
  FormHelperText,
  FormLabel,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { i18n, TFunction } from 'i18next';
import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { relativeExpiryDate } from 'utils/dateFormatter';
import { Input } from 'components/input';

interface ExpireDateFieldProps {
  form: any;
  disabled: boolean;
  t: TFunction<'translation', undefined, 'translation'>;
  i18n: i18n;
}

export const ExpireDateField = ({ form, t, i18n, disabled }: ExpireDateFieldProps) => {
  return (
    <FormControl mb={'10px'}>
      <FormLabel>{t('userDialog.expiryDate')}</FormLabel>
      <Controller
        name="expire"
        control={form.control}
        render={({ field }) => {
          function createDateAsUTC(num: number) {
            return dayjs(
              dayjs(num * 1000).utc()
              // .format("MMMM D, YYYY") // exception with: dayjs.locale(lng);
            ).toDate();
          }
          const { status, time } = relativeExpiryDate(
            field.value
          );
          return (
            <>
              <ReactDatePicker
                locale={i18n.language.toLocaleLowerCase()}
                dateFormat={t('dateFormat')}
                minDate={new Date()}
                selected={
                  field.value
                    ? createDateAsUTC(field.value)
                    : undefined
                }
                onChange={(date: Date) => {
                  field.onChange({
                    target: {
                      value: date
                        ? dayjs(
                          dayjs(date)
                            .set('hour', 23)
                            .set('minute', 59)
                            .set('second', 59)
                        )
                          .utc()
                          .valueOf() / 1000
                        : 0,
                      name: 'expire',
                    },
                  });
                }}
                customInput={
                  <Input
                    size="sm"
                    type="text"
                    borderRadius="6px"
                    clearable
                    disabled={disabled}
                    error={
                      form.formState.errors.expire?.message
                    }
                  />
                }
              />
              {field.value ? (
                <FormHelperText>
                  {t(status, { time: time })}
                </FormHelperText>
              ) : (
                ''
              )}
            </>
          );
        }}
      />
    </FormControl>
  )
}
