
import {
  Box,
  Flex,
  Stack,
} from '@chakra-ui/react';
import { ListCheckBox } from 'components/list-check-box';
import { forwardRef, ReactNode } from 'react';
import {
  useFormContext,
} from 'react-hook-form';
import { Service } from 'types/Service';

interface ServicesSelectListProps {
  list: Service[];
  renderCheckboxContent: (service: Service) => ReactNode;
}

export const ServicesSelectList = forwardRef<HTMLDivElement, ServicesSelectListProps>(
  function({ list, renderCheckboxContent }, ref) {
    const form = useFormContext();

    const handleServiceToggle = (serviceId: number) => {
      const currentServices = form.getValues('services');
      const isSelected = currentServices.includes(serviceId);

      let updatedServices;

      if (isSelected) {
        updatedServices = currentServices.filter((id: number) => id !== serviceId);
      } else {
        updatedServices = [...currentServices, serviceId];
      }

      form.setValue('services', updatedServices, { shouldValidate: true });
    };

    return (
      <Stack spacing={3} ref={ref}>
        {list.map((service: Service) => (
          <Box key={service.id}>
            <Flex align="center">
              <ListCheckBox
                isChecked={form.getValues('services').includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                value={String(service.id)}
                renderContent={() => renderCheckboxContent(service)}
              />
            </Flex>
          </Box>
        ))}
      </Stack>
    );
  }
);
