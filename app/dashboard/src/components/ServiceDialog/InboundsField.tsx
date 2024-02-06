import { FormControl, FormLabel, FormErrorMessage, Center, Spinner, Text, Spacer, Flex } from '@chakra-ui/react';
import { Inbounds, InboundType } from 'contexts/DashboardContext';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';
import { InboundsSelectList } from './InboundsSelectList';


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
                <>
                  <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.100' }} fontWeight="medium">
                    {inbound.tag} {inbound.protocol}
                  </Text>
                  <Spacer />
                  <Flex flexDirection="row" alignItems="center">
                  </Flex>
                </>
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
