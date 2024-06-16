import {
    FormControl,
    FormField,
    FormItem,
    Input,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { FC, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const OnHoldExpireDurationField: FC = () => {
    const form = useFormContext();
    const { t } = useTranslation();

    const defaultDuration = (form.getValues('on_hold_expire_duration') ?? 0) / 86400;
    const [duration, setDuration] = useState<number>(defaultDuration);

    useEffect(() => {
        form.setValue('on_hold_expire_duration', duration * 86400);
    }, [form, duration]);

    return (
        <FormField
            control={form.control}
            name="on_hold_expire_duration"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('page.users.on_hold_expire_duration')} ({t('days')})</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type="number"
                            value={duration}
                            onChange={(e) => {
                                setDuration(Number(e.target.value));
                                field.onChange(e.target.value);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
