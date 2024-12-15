import { Info, TriangleAlert, OctagonAlert } from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@marzneshin/common/components';

export const AlertCard = ({ title, desc, variant = "default" }: { variant?: "warning" | "default" | "destructive", title: string | JSX.Element, desc: string | JSX.Element }) => {
    const Icon = variant === "warning" ? TriangleAlert : (variant === "destructive" ? OctagonAlert : Info)
    return (
        <Alert variant={variant}>
            <Icon className="mr-2" />
            <AlertTitle className="font-semibold">{title}</AlertTitle>
            <AlertDescription>
                {desc}
            </AlertDescription>
        </Alert>
    )
}

