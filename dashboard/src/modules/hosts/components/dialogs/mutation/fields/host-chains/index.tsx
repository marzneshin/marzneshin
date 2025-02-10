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
import { HostsSelectionQuery } from "./host-selection";
import { HostItem } from "./host-item";
import { ChainedHostsProvider, ChainedHostsStore, useChainedHostsStore } from "./store";

export const HostChainsField = () => {
    const { t } = useTranslation();
    const form = useFormContext();

    const fieldsArray = useFieldArray({
        control: form.control,
        name: "chain_ids",
    });

    const { selectedHosts, addHost, removeHost } = useChainedHostsStore(
        (state: ChainedHostsStore) => ({
            selectedHosts: state.selectedHosts,
            addHost: state.addHost,
            removeHost: state.removeHost,
        }),
    );

    return (
        <ChainedHostsProvider
            form={form}
            fieldsArray={fieldsArray}
            selectedHostsIds={form.watch("chain_ids")?.map((hostId: number) => hostId) ?? []}
        >
            <FormField
                control={form.control}
                name="chain_ids"
                render={({ field }) => (
                    <>
                        <FormLabel className="hstack items-center">
                            {t("page.hosts.host-chain")}
                            <HostsSelectionQuery
                                setSelectedHosts={addHost}
                                selectedHosts={selectedHosts}
                            />
                        </FormLabel>
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Sortable
                                    value={fieldsArray.fields}
                                    onMove={({ activeIndex, overIndex }) =>
                                        fieldsArray.move(activeIndex, overIndex)
                                    }
                                >
                                    <ScrollArea
                                        className="vstack w-full max-h-48 gap-2"
                                    >
                                        {fieldsArray.fields.map((field, index) => (
                                            <HostItem
                                                index={index}
                                                host={field}
                                                onRemove={() => removeHost(field.id)}
                                            />
                                        ))}
                                    </ScrollArea>
                                </Sortable>
                            </FormControl>
                        </FormItem>
                    </>
                )}
            />
        </ChainedHostsProvider>
    );
};
