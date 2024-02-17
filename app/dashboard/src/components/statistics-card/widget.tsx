
import { Box, Text, Card, ChakraProps, HStack } from '@chakra-ui/react';
import { FC } from 'react';
import { StatisticCardProps } from './statistics-props';

export const StatisticsWidget: FC<ChakraProps & StatisticCardProps> = ({ icon, content, title, ...chakraProps }) => {
    return (
        <Card
            p={6}
            borderWidth="1px"
            borderColor="light-border"
            bg="#F9FAFB"
            _dark={{ borderColor: 'gray.600', bg: 'gray.750' }}
            borderStyle="solid"
            boxShadow="none"
            borderRadius="12px"
            width="full"
            display="flex"
            justifyContent="space-between"
            {...chakraProps}
        >
            <HStack alignItems="center" columnGap="4">
                <Box
                    p="2"
                    position="relative"
                    color="white"
                    _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bg: 'primary.400',
                        display: 'block',
                        w: 'full',
                        h: 'full',
                        borderRadius: '5px',
                        opacity: '.5',
                        z: '1',
                    }}
                    _after={{
                        content: '""',
                        position: 'absolute',
                        top: '-5px',
                        left: '-5px',
                        bg: 'primary.400',
                        display: 'block',
                        w: 'calc(100% + 10px)',
                        h: 'calc(100% + 10px)',
                        borderRadius: '8px',
                        opacity: '.4',
                        z: '1',
                    }}
                >
                    {icon}
                </Box>
                <Text
                    color="gray.600"
                    _dark={{
                        color: 'gray.300',
                    }}
                    fontWeight="medium"
                    textTransform="capitalize"
                    fontSize="sm"
                >
                    {title}
                </Text>
            </HStack>
            <Box fontSize="3xl" fontWeight="semibold" mt="2">
                {content}
            </Box>
        </Card>
    );
};
