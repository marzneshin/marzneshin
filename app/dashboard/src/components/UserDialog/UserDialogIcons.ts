
import { chakra } from '@chakra-ui/react';
import {
  ChartPieIcon,
  PencilIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export const AddUserIcon = chakra(UserPlusIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export const EditUserIcon = chakra(PencilIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export const UserUsageIcon = chakra(ChartPieIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});
