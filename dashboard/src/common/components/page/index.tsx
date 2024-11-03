import { FC, PropsWithChildren, HTMLAttributes } from 'react'
import {
    Card,
    CardContent,
    ScrollArea,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@marzneshin/common/components';
import { cn } from '@marzneshin/common/utils';

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
        <ScrollArea className="w-full h-full overflow-auto">
            <div className="flex flex-col justify-center items-center h-full w-full">
                <Card className="shadow-none sm:w-screen md:w-full border-none p-0 w-full h-full">
                    <CardHeader className="border-none sm:flex-row">
                        <CardTitle className="flex flex-row justify-start items-center text-2xl text-sans">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={cn("flex w-full max-w-full", className)}>
                        {content || children}
                    </CardContent>
                    {footer && <CardFooter> {footer} </CardFooter>}
                </Card>
            </div>
        </ScrollArea>
    );
}
