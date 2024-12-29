import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/common/components';
import { type FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const UsageDurationField: FC = () => {
    const form = useFormContext();
    const { t } = useTranslation();

    const defaultDuration = (form.getValues('usage_duration') ?? null) / 86400;
    const [duration, setDuration] = useState<number | null>(defaultDuration);

    useEffect(() => {
        form.setValue('usage_duration', duration !== null ? duration * 86400 : null);
    }, [form, duration]);

    return (
        <FormField
            control={form.control}
            name="usage_duration"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('page.users.usage_duration')} ({t('days')})</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type="number"
                            value={duration !== null ? duration : ''}
                            onChange={(e) => {
                                const value = e.target.value !== '' ? Number(e.target.value) : null;
                                setDuration(value);
                                field.onChange(value);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
