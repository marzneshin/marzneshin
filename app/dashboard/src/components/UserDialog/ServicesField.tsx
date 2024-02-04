import { FormControl, FormLabel, FormErrorMessage, Center, Spinner, Text, Spacer, Flex, chakra } from '@chakra-ui/react';
import { UsersIcon, ServerStackIcon } from '@heroicons/react/24/outline';
import { IconBaseStyle } from 'constants/IconBaseStyle';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';
import { Service } from 'types/Service';
import { ServicePropertyStatus } from './ServicePropertyStatus';
import { ServicesSelectList } from './ServicesSelectList';

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
                <>
                  <Text fontSize="sm" color="gray.700" fontWeight="medium">
                    {service.name}
                  </Text>
                  <Spacer />
                  <Flex flexDirection="row" alignItems="center">
                    <ServicePropertyStatus value={service.users.length} StatusIcon={UsersServiceIcon} />
                    <Text color="primary.600" mx="8px">/</Text>
                    <ServicePropertyStatus value={service.inbounds.length} StatusIcon={InboundsServiceIcon} />
                  </Flex>
                </>
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
