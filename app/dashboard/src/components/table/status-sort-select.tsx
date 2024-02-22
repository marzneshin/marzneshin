
import { Select } from '@chakra-ui/react'
import { FilterType } from 'types';
import React from 'react'

interface StatusSortSelectProps {
  filters: FilterType;
  handleStatusFilter: (e: any) => void;
  options: string[];
}

export const StatusSortSelect: React.FC<StatusSortSelectProps> = ({ filters, handleStatusFilter, options }) => {
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
        {options.map((option, i) => <option key={i}>{option}</option>)}
      </Select>
    </div>
  )
}
