
import { Select } from '@chakra-ui/react'
import { UsersFilterType } from 'contexts/DashboardContext'
import React from 'react'

interface StatusSortSelectProps {
    filters: UsersFilterType;
    handleStatusFilter: (e: any) => void;
}

export const StatusSortSelect: React.FC<StatusSortSelectProps> = ({ filters, handleStatusFilter }) => {
  return (
    <div>
      <Select
        value={filters.sort}
        fontSize="xs"
        fontWeight="extrabold"
        textTransform="uppercase"
        cursor="pointer"
        p={0}
        border={0}
        h="auto"
        w="auto"
        icon={<></>}
        _focusVisible={{
          border: '0 !important',
        }}
        onChange={handleStatusFilter}
      >
        <option></option>
        <option>active</option>
        <option>disabled</option>
        <option>limited</option>
        <option>expired</option>
      </Select>

    </div>
  )
}
