import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@marzneshin/components';

export const AlertCard = ({ title, desc }: { title: string, desc: string }) => {
    return (
        <Alert>
            <ExclamationTriangleIcon className="mr-2" />
            <AlertTitle className="font-semibold text-primary">{title}</AlertTitle>
            <AlertDescription>
                {desc}
            </AlertDescription>
        </Alert>
    )
}

