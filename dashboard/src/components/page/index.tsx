import { FC, PropsWithChildren } from 'react'
import { ScrollArea } from '@marzneshin/components'

interface PageProps extends PropsWithChildren { }

export const Page: FC<PageProps> = ({ children }) => {
    return (
        <ScrollArea className="w-full h-full overflow-y-auto">
            <div className="flex flex-col justify-center items-center h-full w-full">
                {children}
            </div>
        </ScrollArea>
    );
}
