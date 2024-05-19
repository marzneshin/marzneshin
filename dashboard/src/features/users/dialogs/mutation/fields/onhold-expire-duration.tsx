
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

interface OnHoldExpireDurationFieldProps { }

export const OnHoldExpireDurationField: FC<OnHoldExpireDurationFieldProps> = () => {
    const form = useFormContext()
    const [duration, setDuration] = useState<number>(0)
    useEffect(() => {
        form.setValue('on_hold_expire_duration', duration * 86400)
    }, [form, duration])
    const { t } = useTranslation()

    return (
        <FormField
            control={form.control}
            name="on_hold_expire_duration"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('page.users.on_hold_expire_duration')} ({t('days')})</FormLabel>
                    <FormControl>
                        <Input
                            type="number"
                            {...field}
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
