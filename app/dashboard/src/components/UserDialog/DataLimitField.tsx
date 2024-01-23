import { FormControl, FormLabel, Input } from '@chakra-ui/react';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';


interface DataLimitFieldProps {
    form: any;
    disabled: boolean;
    t: TFunction<"translation", undefined, "translation">;
}


export const DataLimitField = ({ form, disabled, t }: DataLimitFieldProps) => {
    return (
        <FormControl mb={"10px"}>
            <FormLabel>{t("userDialog.dataLimit")}</FormLabel>
            <Controller
                control={form.control}
                name="data_limit"
                render={({ field }) => {
                    return (
                        <Input
                            endAdornment="GB"
                            type="number"
                            size="sm"
                            borderRadius="6px"
                            onChange={field.onChange}
                            disabled={disabled}
                            error={
                                form.formState.errors.data_limit?.message
                            }
                            value={field.value ? String(field.value) : ""}
                        />
                    );
                }}
            />
        </FormControl>
    )
}
