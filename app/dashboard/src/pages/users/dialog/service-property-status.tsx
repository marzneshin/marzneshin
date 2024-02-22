import { Flex } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { ChakraIcon } from 'types';


type ServicePropertyStatusProps = {
  value: number;
  StatusIcon: ChakraIcon;
}

export const ServicePropertyStatus: FC<ServicePropertyStatusProps> = ({ value, StatusIcon }) => {
  const [valueState,] = useState(value);
  return (
    <Flex flexDirection="row">
      <StatusIcon />
      <span>{valueState}</span>
    </Flex>
  );
};
