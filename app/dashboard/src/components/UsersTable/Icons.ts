import { chakra } from '@chakra-ui/react';
import {
  CheckIcon,
  ChevronDownIcon,
  ClipboardIcon,
  LinkIcon,
  PencilIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';


export const iconProps = {
  baseStyle: {
    w: {
      base: 4,
      md: 5,
    },
    h: {
      base: 4,
      md: 5,
    },
  },
};

export const CopyIcon = chakra(ClipboardIcon, iconProps);
export const AccordionArrowIcon = chakra(ChevronDownIcon, iconProps);
export const CopiedIcon = chakra(CheckIcon, iconProps);
export const SubscriptionLinkIcon = chakra(LinkIcon, iconProps);
export const QRIcon = chakra(QrCodeIcon, iconProps);
export const EditIcon = chakra(PencilIcon, iconProps);
export const SortIcon = chakra(ChevronDownIcon, {
  baseStyle: {
    width: '15px',
    height: '15px'
  },
});
