import {
    FormControl,
    FormField,
    FormItem,
    Textarea,
    FormLabel,
    FormMessage
} from '@marzneshin/components';
import { FC } from 'react'
import { useTranslation } from 'react-i18next';


interface NoteFieldProps {
    form: any
}

export const NoteField: FC<NoteFieldProps> = (
    { form }
) => {
    const { t } = useTranslation()
    return (
        <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{t('note')}</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Additional information about data"
                            className="resize-none"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
