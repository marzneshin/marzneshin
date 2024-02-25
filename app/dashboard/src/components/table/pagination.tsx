import {
  Box,
  Button,
  ButtonGroup,
  chakra,
  HStack,
  Select,
  Text,
} from '@chakra-ui/react';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
import { ChangeEvent, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterType } from 'types';
import { PageSizeManager } from 'utils/userPreferenceStorage';

const PrevIcon = chakra(ArrowLongLeftIcon, {
  baseStyle: {
    w: 4,
    h: 4,
  },
});
const NextIcon = chakra(ArrowLongRightIcon, {
  baseStyle: {
    w: 4,
    h: 4,
  },
});

export type PaginationType = {
  count: number;
  perPage: number;
  page: number;
  onChange?: (page: number) => void;
};

const MINIMAL_PAGE_ITEM_COUNT = 5;

/**
 * Generate numeric page items around current page.
 *   - Always include first and last page
 *   - Add ellipsis if needed
 */
interface PageItem {
  value: string | number;
  isPlaceholder?: boolean;
}

function validateWidth(width: number): void {
  if (width < MINIMAL_PAGE_ITEM_COUNT || width % 2 === 0) {
    throw new Error(`Must allow at least ${MINIMAL_PAGE_ITEM_COUNT} odd page items`);
  }
}

function generatePageItems(total: number, current: number, width: number): PageItem[] {
  validateWidth(width);

  if (total < width) {
    return Array.from({ length: total }, (_, index) => ({ value: index }));
  }

  const left = Math.max(0, Math.min(total - width, current - Math.floor(width / 2)));
  const right = Math.min(left + width, total);

  const items: PageItem[] = [];

  if (left > 0) {
    items.push({ value: 0 }, { value: 'prev-more', isPlaceholder: true });
  }

  for (let i = left; i < right; i++) {
    items.push({ value: i });
  }

  if (right < total) {
    items.push({ value: 'next-more', isPlaceholder: true }, { value: total - 1 });
  }

  return items;
}

type PaginationProps = {
  total: number;
  onFilterChange: (filters: Partial<FilterType>) => void;
  filters: FilterType;
  pageSizeManager: PageSizeManager;
  pageListsNumbers?: number[];
}

export const Pagination: FC<PaginationProps> = ({
  filters,
  total,
  onFilterChange,
  pageSizeManager,
  pageListsNumbers = [10, 20, 30],
}) => {
  const { limit: perPage, offset } = filters;

  const page = (offset || 0) / (perPage || 1);
  const noPages = Math.ceil(total / (perPage || 1));
  const pages = generatePageItems(noPages, page, 7);

  const changePage = (page: number) => {
    onFilterChange({
      ...filters,
      offset: page * (perPage as number),
    });
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      limit: parseInt(e.target.value),
    });
    pageSizeManager.setPageSize(e.target.value);
  };

  const { t } = useTranslation();

  return (
    <HStack
      justifyContent="space-between"
      mt={4}
      w="full"
      display="flex"
      columnGap={{ lg: 4, md: 0 }}
      rowGap={{ md: 0, base: 4 }}
      flexDirection={{ md: 'row', base: 'column' }}
    >
      <Box order={{ base: 2, md: 1 }}>
        <HStack>
          <Select
            minW="60px"
            value={perPage}
            onChange={handlePageSizeChange}
            size="sm"
            rounded="md"
          >
            {pageListsNumbers.map((list, i) => {
              return (<option key={i}>{list}</option>)
            })}
          </Select>
          <Text whiteSpace={'nowrap'} fontSize="sm">
            {t('itemsPerPage')}
          </Text>
        </HStack>
      </Box>

      <ButtonGroup size="sm" isAttached variant="outline" order={{ base: 1, md: 2 }}>
        <Button
          leftIcon={<PrevIcon />}
          onClick={changePage.bind(null, page - 1)}
          isDisabled={page === 0 || noPages === 0}
        >
          {t('previous')}
        </Button>
        {pages.map((pageItem) => (
          <Button
            key={String(pageItem.value)}
            variant={String(pageItem.value) === String(page) ? 'solid' : 'outline'}
            onClick={() =>
              typeof pageItem.value === 'number' && changePage(pageItem.value)
            }
          >
            {String(pageItem.value) === 'prev-more' || String(pageItem.value) === 'next-more'
              ? '...'
              : (pageItem.value as number) + 1}
          </Button>
        ))}
        <Button
          rightIcon={<NextIcon />}
          onClick={changePage.bind(null, page + 1)}
          isDisabled={page + 1 === noPages || noPages === 0}
        >
          {t('next')}
        </Button>
      </ButtonGroup>
    </HStack>
  );
};
