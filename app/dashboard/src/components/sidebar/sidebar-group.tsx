import { Box, Text, VStack } from '@chakra-ui/react'
import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'

type SidebarGroupProps = {
    titleT: string
}

export const SidebarGroup: FC<PropsWithChildren<SidebarGroupProps>> = ({ titleT, children }) => {
    const { t } = useTranslation();
    return (
        <Box>
            <VStack gap="2">
                <Text w="85%" fontWeight="bold" textTransform="uppercase" fontSize="xs" color="gray.500" >{t(titleT)}</Text>
                {children}
            </VStack>
        </Box>
    );
}
