import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Button,
} from "@marzneshin/components";
import { useWatch, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "lucide-react";

export const FragmentField = () => {
    const { t } = useTranslation();
    const form = useFormContext();

    const fragment = useWatch({ name: "fragment" });
    const disabled = !!fragment;

    const disable = () => {
        form.setValue("fragment.length", "");
        form.setValue("fragment.packets", "");
        form.setValue("fragment.interval", "");
        form.setValue("fragment", null, {
            shouldValidate: true,
            shouldTouch: true,
            shouldDirty: true,
        });
    };

    return (
        <FormField
            control={form.control}
            name="fragment"
            render={() => (
                <FormItem className="my-2 w-full">
                    <FormLabel className="flex flex-row justify-between items-center">
                        {t("fragment")}
                        {disabled && (
                            <Button
                                variant="destructive"
                                className="p-0 size-5 bg-primary-background"
                                onClick={(e) => {
                                    e.preventDefault();
                                    disable();
                                }}
                            >
                                <TrashIcon className="text-red-400" />
                            </Button>
                        )}
                    </FormLabel>
                    <FormControl>
                        <div className="flex flex-row w-full items-center">
                            <FormField
                                name="fragment.packets"
                                render={({ field }) => (
                                    <div className="flex flex-col">
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                {t("page.hosts.fragment.packets")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border rounded-none rounded-s-lg p-2 w-full"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                )}
                            />
                            <FormField
                                name="fragment.length"
                                render={({ field }) => (
                                    <div className="flex flex-col">
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                {t("page.hosts.fragment.length")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input className="rounded-none w-full p-2" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                )}
                            />
                            <FormField
                                name="fragment.interval"
                                render={({ field }) => (
                                    <div className="flex flex-col">
                                        <FormItem>
                                            <FormLabel className="font-medium">
                                                {t("page.hosts.fragment.interval")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="border w-full rounded-none rounded-e-lg p-2"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                )}
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
