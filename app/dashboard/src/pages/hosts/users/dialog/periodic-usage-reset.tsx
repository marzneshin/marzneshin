import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { resetStrategy } from 'constants/Settings';
import { TFunction } from 'i18next';


interface PreiodicUsageResetProps {
  form: any;
  t: TFunction<'translation', undefined, 'translation'>;
}

export const PeriodicUsageReset = ({ form, t }: PreiodicUsageResetProps) => {
  return (
    <FormControl height="66px">
      <FormLabel>
        {t('userDialog.periodicUsageReset')}
      </FormLabel>
      <Controller
        control={form.control}
        name="data_limit_reset_strategy"
        render={({ field }) => {
          return (
            <Select size="sm" {...field}>
              {resetStrategy.map((s) => {
                return (
                  <option key={s.value} value={s.value}>
                    {t(
                      'userDialog.resetStrategy' + s.title
                    )}
                  </option>
                );
              })}
            </Select>
          );
        }}
      />
    </FormControl>
  )
}
