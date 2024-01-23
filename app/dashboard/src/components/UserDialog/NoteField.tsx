import { FormControl, FormLabel, Textarea, FormErrorMessage } from '@chakra-ui/react';
import { TFunction } from 'i18next';

interface NoteFieldProps {
    form: any;
    t: TFunction<"translation", undefined, "translation">;
}

export const NoteField = ({ t, form }: NoteFieldProps) => {
    return (
        <FormControl
            mb={"10px"}
            isInvalid={!!form.formState.errors.note}
        >
            <FormLabel>{t("userDialog.note")}</FormLabel>
            <Textarea {...form.register("note")} />
            <FormErrorMessage>
                {form.formState.errors?.note?.message}
            </FormErrorMessage>
        </FormControl>
    )
}
