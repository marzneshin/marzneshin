import { FC, PropsWithChildren } from 'react'
import { ScrollArea } from '@marzneshin/components'

interface PageProps extends PropsWithChildren { }

export const Page: FC<PageProps> = ({ children }) => {
    return (
        <ScrollArea className="m-3 h-[67rem]">
            {children}
        </ScrollArea>
    );
}
