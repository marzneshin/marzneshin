

import { chakra } from '@chakra-ui/react';
import {
  PencilIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export const AddIcon = chakra(UserPlusIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export const EditIcon = chakra(PencilIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});
