import { ReactElement } from 'react';
import { ChakraIcon } from 'types/ChakraIcon'

export interface PageType {
    path: string;
    name: string;
    element: ReactElement;
    itemIcon: ChakraIcon;
}
