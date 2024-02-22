import { FormControl, FormLabel, FormErrorMessage, Center, Spinner } from '@chakra-ui/react';
import { Inbounds, InboundType } from 'types';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';
import { InboundsSelectList } from './inbounds-select-list';
import { InboundCard } from 'components/inbounds-card';


interface InboundsFieldProps {
  form: any;
  inbounds: Inbounds;
  t: TFunction<'translation', undefined, 'translation'>;
}

export const InboundsField = ({ form, t, inbounds }: InboundsFieldProps) => {
  return inbounds.length === 0 ? (
    <Center><Spinner /></Center>
  ) : (
    <FormControl
      isInvalid={
        !!form.formState.errors.services?.message
      }
    >
      <FormLabel>{t('inbounds')}</FormLabel>
      <Controller
        control={form.control}
        name="inbounds"
        render={() => {
          return (
            <InboundsSelectList
              list={inbounds}
              renderCheckboxContent={(inbound: InboundType) => (
                <InboundCard tag={inbound.tag} protocol={inbound.protocol} nodeName={inbound.node.name} />
              )}
            />
          );
        }}
      />
      <FormErrorMessage>
        {t(form.formState.errors.services?.message as string)}
      </FormErrorMessage>
    </FormControl>
  );
}
