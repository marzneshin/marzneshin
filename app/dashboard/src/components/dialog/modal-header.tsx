
import { Text, HStack, ModalHeader } from '@chakra-ui/react';
import { ChakraIcon } from 'types';
import { Icon } from '../icon';

export const DialogModalHeader = ({ HeaderIcon, title }: { HeaderIcon: ChakraIcon, title: string }) => {
  return (
    <ModalHeader pt={6}>
      <HStack gap={2}>
        <Icon color="primary">
          {HeaderIcon && <HeaderIcon color="white" />}
        </Icon>
        <Text fontWeight="semibold" fontSize="lg">
          {title}
        </Text>
      </HStack>
    </ModalHeader>
  );
}
