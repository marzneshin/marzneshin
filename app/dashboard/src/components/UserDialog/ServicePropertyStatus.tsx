import { Flex } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { ChakraIcon } from 'types/ChakraIcon';


type ServicePropertyStatusProps = {
    value: number;
    StatusIcon: ChakraIcon;
}

export const ServicePropertyStatus: FC<ServicePropertyStatusProps> = ({ value, StatusIcon }) => {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [valueState, _] = useState(value);
  return (
    <Flex flexDirection="row">
      <StatusIcon />
      <span>{valueState}</span>
    </Flex>
  );
};
