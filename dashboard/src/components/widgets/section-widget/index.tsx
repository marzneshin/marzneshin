import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Separator,
} from '@marzneshin/components';
import type { FC, PropsWithChildren } from 'react';

export interface SectionWidgetProps extends PropsWithChildren {
    title: JSX.Element | string;
    content?: JSX.Element | string;
    footer?: JSX.Element | string;
}

export const SectionWidget: FC<SectionWidgetProps> = ({ footer, content, children, title }) => {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="flex flex-row justify-start items-center gap-3 text-xl">
                    {title}
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-4">
                {content || children}
            </CardContent>
            {footer && <CardFooter> {footer} </CardFooter>}
        </Card>
    )
}
