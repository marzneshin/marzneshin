import { ChakraIcon } from 'types'

export type PageType = {
    path: string;
    name: string;
    itemIcon: ChakraIcon;
}

export interface Pages {
    home: PageType;
    users: PageType;
    services: PageType;
    nodes: PageType;
    hosts: PageType;
}
