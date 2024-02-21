
import { chakra } from '@chakra-ui/react';
import { InformationCircleIcon, LinkIcon } from '@heroicons/react/24/outline';

export const ModalIcon = chakra(LinkIcon, {
  baseStyle: {
    w: 5,
    h: 5,
  },
});

export const InfoIcon = chakra(InformationCircleIcon, {
  baseStyle: {
    w: 4,
    h: 4,
    color: 'gray.400',
    cursor: 'pointer',
  },
});
