import { chakra } from '@chakra-ui/react';
import {
    ArrowPathIcon,
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
    Cog6ToothIcon,
} from '@heroicons/react/24/outline';

export const UsageIcon = chakra(Cog6ToothIcon, {
    baseStyle: {
        w: 5,
        h: 5,
    },
});

export const ReloadIcon = chakra(ArrowPathIcon, {
    baseStyle: {
        w: 4,
        h: 4,
    },
});

export const FullScreenIcon = chakra(ArrowsPointingOutIcon, {
    baseStyle: {
        w: 4,
        h: 4,
    },
});
export const ExitFullScreenIcon = chakra(ArrowsPointingInIcon, {
    baseStyle: {
        w: 3,
        h: 3,
    },
});
