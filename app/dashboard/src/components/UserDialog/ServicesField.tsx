import { FormControl, FormLabel, FormErrorMessage, } from '@chakra-ui/react';
import { TFunction } from 'i18next';
import { Controller } from 'react-hook-form';
import { Service } from 'types/Service';
import { ServicesSelectList } from './ServicesSelectList';

interface ServicesFieldProps {
    form: any;
    services: Service[];
    disabled: boolean;
    t: TFunction<"translation", undefined, "translation">;
}

export const ServicesField = ({ form, disabled, t, services }: ServicesFieldProps) => {
    return (

        <FormControl
            isInvalid={
                !!form.formState.errors.services?.message
            }
        >
            <FormLabel>{t("userDialog.services")}</FormLabel>
            <Controller
                control={form.control}
                name="services"
                render={({ field }) => {
                    return (
                        <ServicesSelectList
                            list={services}
                            disabled={disabled}
                            {...field}
                        />
                    );
                }}
            />
            <FormErrorMessage>
                {t(
                    form.formState.errors.services
                        ?.message as string
                )}
            </FormErrorMessage>
        </FormControl>
    );
}
