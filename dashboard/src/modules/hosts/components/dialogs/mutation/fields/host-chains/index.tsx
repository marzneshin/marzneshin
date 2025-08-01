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
    Button,
    SortableDragHandle,
    SortableItem,
} from "@marzneshin/common/components";
import { DragHandleDots2Icon, TrashIcon } from "@radix-ui/react-icons";
import {
    ChainedHostsProvider,
    ChainedHostsStore,
    useChainedHostsStore,
} from "./store";

const HostChainsFormField = ({
    field,
}: {
    field: ControllerRenderProps<FieldValues, "chain_ids">;
}) => {
    const { t } = useTranslation();
    const { fieldsArray, removeHost, selectedHosts } = useChainedHostsStore(
        (state: ChainedHostsStore) => ({
            selectedHosts: state.selectedHosts,
            fieldsArray: state.fieldsArray,
            addHost: state.addHost,
            removeHost: state.removeHost,
        }),
    );

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
                                const hostId = (field as any).value as number;
                                const hostItemData = selectedHosts.find((host) => host.id === hostId);
                                console.log("hostItemdata:" + hostItemData);
                                console.log(fieldsArray.fields);
                                return (
                                    hostItemData &&
                                    hostItemData.id !== undefined && (
                                        <SortableItem
                                            key={field.id}
                                            value={field.id}
                                            asChild
                                        >
                                            <div className="grid grid-cols-[2fr,1.3fr,0.25fr] items-center justify-start gap-2 my-2">
                                                <SortableDragHandle
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-8 shrink-0"
                                                >
                                                    <DragHandleDots2Icon
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                </SortableDragHandle>
                                                {hostItemData.remark}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    className="size-8 shrink-0"
                                                    onClick={() =>
                                                        removeHost(index)
                                                    }
                                                >
                                                    <TrashIcon
                                                        className="size-4 text-destructive"
                                                        aria-hidden="true"
                                                    />
                                                    <span className="sr-only">
                                                        Remove
                                                    </span>
                                                </Button>
                                            </div>
                                        </SortableItem>
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
