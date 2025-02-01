import {
    Button,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@marzneshin/common/components";
import type { FieldError, FieldErrors } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ListPlus, MailWarning, TrashIcon } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { noiseTypes } from "../profiles";

interface NoiseForm {
    noise: Array<{
        type: string;
        packet: string;
        delay: string;
    } | null>;
}

const NoiseErrorPopover: FC<{
    errors?: { packet?: FieldError; type?: FieldError; delay?: FieldError };
}> = ({ errors }) => {
    const { t } = useTranslation();

    if (!errors || (!errors.packet && !errors.type && !errors.delay))
        return null;

    return (
        <Popover>
            <PopoverTrigger>
                <MailWarning className="p-0 size-5 text-destructive bg-primary-background" />
            </PopoverTrigger>
            <PopoverContent className="bg-destructive-accent text-sm">
                <ul className="my-6 ml-3 list-disc [&>li]:mt-1 mt-0">
                    {errors.type?.message && (
                        <li>
                            <b>Type:</b> {t(errors.type.message as string)}
                        </li>
                    )}
                    {errors.packet?.message && (
                        <li>
                            <b>Packet:</b> {t(errors.packet.message as string)}
                        </li>
                    )}
                    {errors.delay?.message && (
                        <li>
                            <b>Interval:</b> {t(errors.delay.message as string)}
                        </li>
                    )}
                </ul>
            </PopoverContent>
        </Popover>
    );
};

export const NoiseField = () => {
    const { t } = useTranslation();
    const form = useFormContext();
    const [forms, setForms] = useState<NoiseForm["noise"][number][]>(
        form.getValues("noise") || [],
    );

    const errors = form.formState.errors as FieldErrors<NoiseForm>;

    const addForm = () => {
        if (forms.length < 5) {
            const newForms = [
                ...forms,
                { type: "rand", packet: "", delay: "" },
            ];
            setForms(newForms);
            form.setValue("noise", newForms, { shouldValidate: true });
        }
    };

    const removeForm = (index: number) => {
        const updatedForms = forms.filter((_, i) => i !== index);
        setForms(updatedForms);
        form.setValue("noise", updatedForms, { shouldValidate: true });
    };

    const enableForm = (index: number) => {
        const updatedForms = [...forms];
        updatedForms[index] = { type: "", packet: "", delay: "" };
        setForms(updatedForms);
        form.setValue("noise", updatedForms, { shouldValidate: true });
    };

    return (
        <div>
            {forms.length > 0 ? (
                forms.map((formData, index) => (
                    <FormItem key={index} className="my-2 w-full">
                        {index === 0 && (
                            <FormLabel className="flex flex-row justify-between items-center">
                                {t("Noise")}
                                <div className="flex flex-row items-center gap-2">
                                    {errors.noise?.[index] && (
                                        <NoiseErrorPopover
                                        // errors={errors.noise[index]}
                                        />
                                    )}
                                    {forms.length < 5 && (
                                        <Button
                                            className="p-0 size-5 bg-primary-background"
                                            variant="secondary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addForm();
                                            }}
                                        >
                                            <ListPlus />
                                        </Button>
                                    )}
                                </div>
                            </FormLabel>
                        )}
                        <FormControl>
                            <div className="flex flex-row w-full items-center gap-2">
                                {formData ? (
                                    <>
                                        <FormField
                                            name={`noise.${index}.type`}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-2/5">
                                                            <SelectValue placeholder="Noise Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {noiseTypes.map(
                                                            (option) => (
                                                                <SelectItem
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        <div className="w-full hstack">
                                            <FormField
                                                name={`noise.${index}.packet`}
                                                render={({ field }) => (
                                                    <Input
                                                        className="border rounded-none rounded-s-lg p-2 w-full"
                                                        placeholder="Packet"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                            <FormField
                                                name={`noise.${index}.delay`}
                                                render={({ field }) => (
                                                    <Input
                                                        placeholder="Delay"
                                                        className="border w-full rounded-none rounded-e-lg p-2"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            className="p-0 size-5 bg-primary-background"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeForm(index);
                                            }}
                                        >
                                            <TrashIcon className="text-red-400" />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        className="border w-full"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enableForm(index);
                                        }}
                                    >
                                        {t("Enable Form")}
                                    </Button>
                                )}
                            </div>
                        </FormControl>
                    </FormItem>
                ))
            ) : (
                <FormItem className="my-2 w-full">
                    <FormLabel className="flex flex-row justify-between items-center">
                        {t("Noise")}
                    </FormLabel>

                    <Button
                        className="border w-full"
                        variant="ghost"
                        onClick={(e) => {
                            e.preventDefault();
                            addForm();
                        }}
                    >
                        {t("disabled")}
                    </Button>
                </FormItem>
            )}
        </div>
    );
};
