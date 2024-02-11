import { SortIcon } from './Icons';
import { FC } from 'react';

type SortType = {
    sort: string;
    column: string;
};

export const Sort: FC<SortType> = ({ sort, column }) => {
  if (sort.includes(column))
    return (
      <SortIcon
        transform={sort.startsWith('-') ? undefined : 'rotate(180deg)'} />
    );
  return null;
};
