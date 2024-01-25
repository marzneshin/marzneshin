import { ReactElement } from 'react';
import { ChakraIcon } from 'types/ChakraIcon'

export interface PageType {
    path: string;
    name: string;
    errorElement: ReactElement;
    element: ReactElement;
    loader: () => Promise<any>;
    itemIcon: ChakraIcon;
}
