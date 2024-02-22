import { Flex } from '@chakra-ui/react';
import { FC, useState } from 'react';
import { ChakraIcon } from 'types';

type SystemPropertyStatusProps = {
    value: number | string;
    StatusIcon: ChakraIcon;
}

export const SystemPropertyStatus: FC<SystemPropertyStatusProps> = ({ value, StatusIcon }) => {
    const [valueState,] = useState(value);
    return (
        <Flex flexDirection="row">
            <StatusIcon />
            <span>{valueState}</span>
        </Flex>
    );
};
