import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/common/components';
import { FC } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DataLimitFieldProps {
    disabled: boolean;
    onChange: (value: number | undefined) => void;
}

export const DataLimitField: FC<DataLimitFieldProps> = ({ disabled, onChange }) => {
    const { t } = useTranslation()
    const form = useFormContext()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? undefined : Number(event.target.value)
        onChange(value)
        field.onChange(value)
    }
    const { t } = useTranslation()
    const form = useFormContext()
    return (
        <FormField
            control={form.control}
            name="data_limit"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t('page.users.traffic')}</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            className="order-1"
                            {...field}
                            disabled={disabled}
                            onChange={handleChange}
                            placeholder={disabled ? "Unlimited" : "GB"}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
        <FormField
            control={form.control}
            name="data_limit"
            render={({ field }) => (
                <FormItem className="w-full">
                    <FormLabel>{t('page.users.traffic')}</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            className="order-1"
                            {...field}
                            placeholder="GB"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
}
