import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    ScrollArea,
    Sortable,
} from "@marzneshin/common/components";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HostsSelectionQuery } from "@marzneshin/modules/hosts";
import { HostItem } from "./host-item";

export const HostChainsField = () => {
    const { t } = useTranslation();
    const form = useFormContext();

    const { fields, append, move, remove } = useFieldArray({
        control: form.control,
        name: "chain_ids",
    });

    return (
        <FormField
            control={form.control}
            name="chain_ids"
            render={({ field }) => (
                <>
                    <FormLabel className="hstack items-center">
                        {t("page.hosts.host-chain")}
                        <HostsSelectionQuery
                            setSelectedHosts={field.onChange}
                            selectedHosts={field.value}
                        />
                    </FormLabel>
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                        <FormControl>
                            <Sortable
                                value={fields}
                                onMove={({ activeIndex, overIndex }) =>
                                    move(activeIndex, overIndex)
                                }
                            >
                                <ScrollArea
                                    className="vstack w-full max-h-48 gap-2"
                                    type="always"
                                >
                                    {fields.map((field, index) => (
                                        <HostItem
                                            index={index}
                                            host={}
                                            onRemove={remove}
                                        />
                                    ))}
                                </ScrollArea>
                            </Sortable>
                        </FormControl>
                    </FormItem>
                </>
            )}
        />
    );
};
