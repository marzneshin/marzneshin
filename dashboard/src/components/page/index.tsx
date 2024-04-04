import { FC, PropsWithChildren } from 'react'
import { ScrollArea } from '@marzneshin/components'

interface PageProps extends PropsWithChildren { }

/* WARN: The current page height which effect the scroll
*  area activness, is calculated based on height of header 
*  and margin.
*/

export const Page: FC<PageProps> = ({ children }) => {
    return (
        <ScrollArea style={{ height: `calc(100vh - 4.5rem)` }} className="m-3">
            {children}
        </ScrollArea>
    );
}
