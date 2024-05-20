import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@marzneshin/components'
import { FC } from 'react'

export interface MiniWidgetProps {
    title: JSX.Element | string;
    content: JSX.Element | string;
    footer?: JSX.Element | string;
}

export const MiniWidget: FC<MiniWidgetProps> = ({ footer, content, title }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
            {footer && <CardFooter> {footer} </CardFooter>}
        </Card>
    )
}
