
import { FC } from 'react'
import { NodeType, NodesStatus, NodesStatusBadge } from '../..'
import { Table, TableCell, TableHead, TableRow } from '@marzneshin/components'
import { useTranslation } from 'react-i18next'


interface NodesDetailTableProps {
    node: NodeType
}


export const NodesDetailTable: FC<NodesDetailTableProps> = ({ node }) => {
    const { t } = useTranslation()
    return (
        <Table>
            <TableRow >
                <TableHead >
                    {t('name')}
                </TableHead>
                <TableCell >
                    {node.name}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableHead >
                    {t('Address')}
                </TableHead>
                <TableCell >
                    {node.address}:{node.port}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableHead className="p-5">
                    {t('page.nodes.usage_coefficient')}
                </TableHead>
                <TableCell >
                    {node.usage_coefficient}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableHead>
                    {t('status')}
                </TableHead>
                <TableCell>
                    <NodesStatusBadge status={NodesStatus[node.status]} />
                </TableCell>
            </TableRow>
        </Table>
    )
}
