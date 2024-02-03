
import {
  Box,
  Flex,
  Stack,
} from '@chakra-ui/react';
import { ListCheckBox } from 'components/ListCheckBox';
import { Inbounds, InboundType } from 'contexts/DashboardContext';
import { forwardRef, ReactNode } from 'react';
import {
  useFormContext,
} from 'react-hook-form';

interface InboundsSelectListProps {
    list: Inbounds;
    renderCheckboxContent: (inbound: InboundType) => ReactNode;
}

export const InboundsSelectList = forwardRef<HTMLDivElement, InboundsSelectListProps>(
  function({ list, renderCheckboxContent }, ref) {
    const form = useFormContext();

    const handleInboundToggle = (inboundId: number) => {
      const currentInbounds = form.getValues('inbounds');
      const isSelected = currentInbounds.includes(inboundId);

      let updatedInbounds = currentInbounds.filter((id: number) => id !== inboundId);

      if (!isSelected) {
        updatedInbounds = [...currentInbounds, inboundId];
      }

      form.setValue('inbounds', updatedInbounds, { shouldValidate: true });
    };

    return (
      <Stack spacing={3} ref={ref}>
        {list.map((inbound: InboundType) => (
          <Box key={inbound.id}>
            <Flex align="center">
              <ListCheckBox
                isChecked={form.getValues('inbounds').includes(inbound.id)}
                onChange={() => handleInboundToggle(inbound.id)}
                value={String(inbound.id)}
                renderContent={() => renderCheckboxContent(inbound)}
              />
            </Flex>
          </Box>
        ))}
      </Stack>
    );
  }
);
