import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface UsernameFieldProps { }

export const UsernameField: FC<UsernameFieldProps> = () => {
    const form = useFormContext()
    const { t } = useTranslation()
    return (
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
