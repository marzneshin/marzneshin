import { FC, PropsWithChildren } from 'react'
import { ScrollArea } from '@marzneshin/components'

interface PageProps extends PropsWithChildren { }

export const Page: FC<PageProps> = ({ children }) => {
    return (
        <ScrollArea style={{ height: `calc(100vh - 4.5rem)` }} className="m-3">
            {children}
        </ScrollArea>
    );
}
