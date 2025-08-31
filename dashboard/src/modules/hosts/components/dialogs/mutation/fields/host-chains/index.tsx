import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    ScrollArea,
    Sortable,
} from "@marzneshin/common/components";
import {
    ControllerRenderProps,
    FieldValues,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HostsSelectionQuery } from "./host-selection";
import {
    ChainedHostsProvider,
    ChainedHostsStore,
    useChainedHostsStore,
} from "./store";
import { HostChainItem } from "./host-chain-items";

const HostChainsFormField = ({
    field,
}: {
    field: ControllerRenderProps<FieldValues, "chain_ids">;
}) => {
    const { t } = useTranslation();
    const { fieldsArray, removeHost, selectedHosts, form } =
        useChainedHostsStore((state: ChainedHostsStore) => ({
            selectedHosts: state.selectedHosts,
            fieldsArray: state.fieldsArray,
            addHost: state.addHost,
            removeHost: state.removeHost,
            form: state.form,
        }));
    const chainIds = form.watch("chain_ids") as number[];

    return (
        <>
            <FormLabel className="hstack items-center">
                {t("page.hosts.host-chain")}
                <HostsSelectionQuery />
            </FormLabel>
            <Sortable
                value={fieldsArray.fields}
                onMove={({ activeIndex, overIndex }) =>
                    fieldsArray.move(activeIndex, overIndex)
                }
            >
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl {...field}>
                        <ScrollArea className="vstack w-full max-h-48 h-32 gap-2">
                            {fieldsArray.fields.map((field, index) => {
                                const hostId = chainIds[index];
                                const hostItemData = selectedHosts.find(
                                    (host) => host.id === hostId,
                                );
                                console.log(hostItemData)
                                return (
                                    hostItemData &&
                                    hostItemData.id !== undefined && (
                                        <HostChainItem
                                            field={field}
                                            hostItemData={hostItemData}
                                            removeHost={removeHost}
                                            index={index}
                                        />
                                    )
                                );
                            })}
                        </ScrollArea>
                    </FormControl>
                </FormItem>
            </Sortable>
        </>
    );
};

export const HostChainsField = () => {
    const form = useFormContext();

    const fieldsArray = useFieldArray({
        control: form.control,
        name: "chain_ids",
    });

    return (
        <ChainedHostsProvider
            form={form}
            fieldsArray={fieldsArray}
            selectedHostsIds={
                form.watch("chain_ids")?.map((hostId: number) => hostId) ?? []
            }
        >
            <FormField
                control={form.control}
                name="chain_ids"
                render={({ field }) => <HostChainsFormField field={field} />}
            />
        </ChainedHostsProvider>
    );
};

