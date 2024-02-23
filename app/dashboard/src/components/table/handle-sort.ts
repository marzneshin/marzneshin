
import { FilterType } from 'types';

export const handleSort = (
  filters: FilterType,
  column: string,
  onFilterChange: (filters: Partial<FilterType>) => void
) => {
  let newSort = filters.sort;
  if (newSort.includes(column)) {
    if (newSort.startsWith('-')) {
      newSort = '-created_at';
    } else {
      newSort = '-' + column;
    }
  } else {
    newSort = column;
  }
  onFilterChange({
    sort: newSort,
  });
};
