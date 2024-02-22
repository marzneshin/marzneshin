import { FormControl, FormLabel, FormErrorMessage, Center, Spinner, Text, Flex, chakra } from '@chakra-ui/react';
import { UsersIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import { IconBaseStyle } from 'constants/IconBaseStyle';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';
import { Service } from 'types';
import { SystemPropertyStatus } from 'components/system-property-status';
import { ServicesSelectList } from './services-select-list';

const UsersServiceIcon = chakra(UsersIcon, IconBaseStyle);
const InboundsServiceIcon = chakra(ServerStackIcon, IconBaseStyle);

interface ServicesFieldProps {
  form: any;
  services: Service[];
  t: TFunction<'translation', undefined, 'translation'>;
}

export const ServicesField = ({ form, t, services }: ServicesFieldProps) => {
  return services.length === 0 ? (
    <Center><Spinner /></Center>
  ) : (
    <FormControl
      isInvalid={
        !!form.formState.errors.services?.message
      }
    >
      <FormLabel>{t('userDialog.services')}</FormLabel>
      <Controller
        control={form.control}
        name="services"
        render={() => {
          return (
            <ServicesSelectList
              list={services}
              renderCheckboxContent={(service) => (
                <Flex alignItems="center" justifyContent="space-between" flexDir="row" w="full">
                  <Text fontSize="sm" color="gray.700" _dark={{ color: 'gray.100' }} fontWeight="medium">
                    {service.name}
                  </Text>
                  <Flex flexDirection="row" alignItems="center">
                    <SystemPropertyStatus value={service.users.length} StatusIcon={UsersServiceIcon} />
                    <Text color="primary.600" _dark={{ color: 'gray.100' }} mx="8px" fontSize="sm">/</Text>
                    <SystemPropertyStatus value={service.inbounds.length} StatusIcon={InboundsServiceIcon} />
                  </Flex>
                </Flex>
              )}
            />
          );
        }}
      />
      <FormErrorMessage>
        {t(
          form.formState.errors.services
            ?.message as string
        )}
      </FormErrorMessage>
    </FormControl>
  );
}
