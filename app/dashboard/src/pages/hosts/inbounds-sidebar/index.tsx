import { Table, Thead, Tbody, Th, Td, Tr, HStack } from '@chakra-ui/react';
import { InboundCard } from 'components/inbounds-card';
import { useTranslation } from 'react-i18next';
import { useInbounds } from 'stores';

export const InboundsSidebar = () => {
  const { inbounds, selectInbound, refetchInbounds } = useInbounds();
  const { t } = useTranslation();
  inbounds.length === 0 && refetchInbounds();
  return (
    <Table orientation="vertical" zIndex="docked" >
      <Thead zIndex="docked" position="relative">
        <Tr>
          <Th
            minW="120px"
            pl={4}
            pr={4}
            cursor={'pointer'}
            // onClick={handleSort.bind(null, filters, 'remark', onFilterChange)}
          >
            <HStack>
              <span>{t('inbounds')}</span>
              {/* <Sort sort={filters.sort} column="remark" /> */}
            </HStack>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {inbounds.map((inbound, i) => {
          return (
            <Tr key={i} onClick={() => { selectInbound(inbound) }}>
              <Td>
                <InboundCard

                  tag={inbound.tag}
                  nodeName={inbound.node.name}
                  protocol={inbound.protocol}
                />
              </Td>
            </Tr>);
        })}
      </Tbody>
    </Table>
  )
}
