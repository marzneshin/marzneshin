/* Inbounds Card Component
 * 
 * - name
 * - protocol
 * - Nodes number
*/

import { FC, PropsWithChildren } from 'react'
import { ProtocolType } from 'types'
import { Text, Spacer, VStack, chakra, Flex } from '@chakra-ui/react';
import { IconBaseStyle } from 'constants/IconBaseStyle';
import { ServerStackIcon } from '@heroicons/react/24/outline';
import { SystemPropertyStatus } from 'components/system-property-status';

type InboundCardProps = {
  tag: string,
  protocol: ProtocolType,
  nodeName: string;
}

const InboundsIcon = chakra(ServerStackIcon, IconBaseStyle);

export const BadgeTag: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text fontSize="sm" color="primary.700" _dark={{ color: 'gray.100', bg: 'primary.700' }} bg="gray.100" pl="3px" pr="3px" border="1px" borderRadius="md" borderColor="primary.700" fontWeight="light">
      {children}
    </Text>
  )
}

export const InboundCard: FC<InboundCardProps> = ({ tag, protocol, nodeName }) => {
  return (
    <VStack justifyContent={'start'} alignItems={'start'} w="full">
      <Text fontSize="md" color="gray.700" _dark={{ color: 'gray.100' }} fontWeight="semibold">
        {tag}
      </Text>
      <Flex justifyContent={'spaced-between'} flexDir="row" w="full">
        <SystemPropertyStatus value={nodeName} StatusIcon={InboundsIcon} />
        <Spacer />
        <BadgeTag>
          {protocol}
        </BadgeTag>
      </Flex>
    </VStack >
  )
}
