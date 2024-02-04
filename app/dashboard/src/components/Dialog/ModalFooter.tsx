import React, { ReactNode } from 'react';
import {
  HStack,
} from '@chakra-ui/react';
import { ModalFooter } from '@chakra-ui/react';

interface UserDialogFooterProps {
  children: ReactNode
}

export const DialogModalFooter: React.FC<UserDialogFooterProps> = ({
  children
}) => {

  return (
    <ModalFooter mt="3">
      <HStack
        justifyContent="space-between"
        w="full"
        gap={3}
        flexDirection={{
          base: 'column',
          sm: 'row',
        }}
      >
        {children}
      </HStack>
    </ModalFooter >
  );
};
