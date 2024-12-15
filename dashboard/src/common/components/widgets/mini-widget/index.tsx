import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@marzneshin/common/components';
import type { FC, PropsWithChildren } from 'react';

export interface MiniWidgetProps extends PropsWithChildren {
    title: JSX.Element | string;
    content?: JSX.Element | string;
    footer?: JSX.Element | string;
}

export const MiniWidget: FC<MiniWidgetProps> = ({ footer, content, children, title }) => {
    return (
        <Card>
            <CardHeader className="p-4">
                <CardTitle className="flex flex-row justify-start items-center gap-3 text-lg">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {content || children}
            </CardContent>
            {footer && <CardFooter> {footer} </CardFooter>}
        </Card>
    )
}
