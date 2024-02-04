

import {
  Box,
} from '@chakra-ui/react';
import { forwardRef, ReactNode, Ref } from 'react';

type ListCheckboxProps = {
    isChecked: boolean;
    onChange: () => void;
    renderContent: () => ReactNode;
    value: string;
}

export const ListCheckBox = forwardRef(
  (
    { isChecked, onChange, renderContent, ...props }: ListCheckboxProps,
    ref: Ref<HTMLDivElement>
  ) => (
    <Box
      ref={ref}
      border={isChecked ? '5px' : '2px'}
      w="full"
      borderColor={isChecked ? 'primary.500' : 'gray.600'}
      boxShadow={
        isChecked
          ? '0 0 0 3px rgba(102, 126, 234, 0.6)'
          : '0 0 0 1px rgba(102, 126, 234, 0.6)'
      }
      bg={isChecked ? 'gray.100' : 'white'}
      py="4px"
      px="8px"
      borderRadius="md"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _hover={{
        cursor: 'pointer',
        borderColor: 'primary.300',
      }}
      onClick={onChange}
      {...props}
    >
      {renderContent()}
    </Box>
  )
);
