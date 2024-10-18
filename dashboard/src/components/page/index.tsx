import { FC, PropsWithChildren, HTMLAttributes } from 'react'
import {
    Card,
    CardContent,
    ScrollArea,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@marzneshin/components';
import { cn } from '@marzneshin/utils';

interface PageProps {
    title: JSX.Element | string;
    content?: JSX.Element | string;
    footer?: JSX.Element | string;
}

export const Page: FC<PageProps & PropsWithChildren & HTMLAttributes<HTMLDivElement>> = ({
    footer,
    content,
    children,
    title,
    className
}) => {
    return (
        <ScrollArea className="h-full w-full">
            <div className="min-h-full w-full p-4">
                <Card className="shadow-none border-none min-h-full w-full">
                    <CardHeader className="border-none px-4 sm:flex-row">
                        <CardTitle className="flex flex-row items-center gap-2 text-xl sm:text-2xl">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={cn("px-4 overflow-x-auto", className)}>
                        <div className="min-w-full w-fit">
                            {content || children}
                        </div>
                    </CardContent>
                    {footer && (
                        <CardFooter className="px-4">
                            {footer}
                        </CardFooter>
                    )}
                </Card>
            </div>
        </ScrollArea>
    );
}
