import { FC, PropsWithChildren } from 'react'
import { ScrollArea } from '@marzneshin/components'

interface PageProps extends PropsWithChildren { }

/* WARN: The current page height which effect the scroll
*  area activness, is calculated based on height of header 
*  and margin.
*/

export const Page: FC<PageProps> = ({ children }) => {
    return (
        <ScrollArea style={{ height: `calc(100vh - 4.8rem)` }} className="sm:w-screen md:p-3 md:w-[100%]">
            <div className="flex flex-col justify-center items-center h-full sm:w-screen md:w-[100%]">
                {children}
            </div>
        </ScrollArea>
    );
}
