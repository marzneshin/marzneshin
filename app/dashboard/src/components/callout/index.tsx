

import { Box, ChakraProps, Text } from '@chakra-ui/react'
import { FC } from 'react'

type CalloutProps = {
    header: string,
    body: string,
};

export const Callout: FC<CalloutProps & ChakraProps> = ({ header, body, ...props }) => {
    return (
        <Box bg="gray.50" _dark={{ bg: 'gray.700' }} borderRadius="10" borderColor="red.500" border="2px" p="4" {...props}>
            <Text fontSize="xl" fontWeight="bold">
                {header}
            </Text>
            {body}
        </Box>
    )
}
