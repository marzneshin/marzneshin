import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { FC } from 'react'
import { useTranslation } from 'react-i18next';

interface DataLimitFieldProps {
    form: any
}

export const DataLimitField: FC<DataLimitFieldProps> = (
    { form }
) => {
    const { t } = useTranslation()
    return (
        <FormField
            control={form.control}
            name="data_limit"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t('page.users.data_limit')}</FormLabel>
                    <FormControl>
                        <Input type="number" className="order-1" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
