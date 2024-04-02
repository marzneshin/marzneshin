import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { UserMutationType } from '@marzneshin/features/users';
import { FC } from 'react'
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface UsernameFieldProps {
    form: UseFormReturn<FieldValues, UserMutationType>
}

export const UsernameField: FC<UsernameFieldProps> = (
    { form }
) => {
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
