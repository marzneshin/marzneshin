import { useContext, createContext, PropsWithChildren, useState } from "react";
import { createStore, StoreApi } from "zustand";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { HostType, useHostsByIdsQuery } from "@marzneshin/modules/hosts";
import {
    FieldValues,
    UseFieldArrayReturn,
    UseFormReturn,
} from "react-hook-form";

export interface ChainedHostsStoreState {
    selectedHosts: HostType[];
    fieldsArray: UseFieldArrayReturn<FieldValues, "chain_ids", "id">;
    form: UseFormReturn;
}

export interface ChainedHostsStoreActions {
    selectedHosts: HostType[];
    addHost: (newHost: HostType) => void;
    removeHost: (id: number) => void;
}

export type ChainedHostsStore = ChainedHostsStoreState &
    ChainedHostsStoreActions;

const ChainedHostsContext = createContext<StoreApi<ChainedHostsStore> | null>(
    null,
);

export const ChainedHostsProvider = ({
    form,
    selectedHostsIds,
    fieldsArray,
    children,
}: PropsWithChildren & {
    form: UseFormReturn;
    fieldsArray: UseFieldArrayReturn<FieldValues, "chain_ids", "id">;
    selectedHostsIds: number[];
}) => {
    const { data } = useHostsByIdsQuery({ hostIds: selectedHostsIds });

    const [store] = useState(() =>
        createStore<ChainedHostsStore>((set, get) => ({
            form,
            fieldsArray,
            selectedHosts: data,
            addHost: (newHost: HostType) => {
                const newChain = [...get().selectedHosts, newHost];
                set({
                    selectedHosts: newChain,
                });
                fieldsArray.append(newHost.id);
            },
            removeHost: (hostId: number) => {
                const fields = get().fieldsArray.fields;
                const idx = fields.findIndex(f => f.value === hostId);
                if (idx < 0) return;
                fieldsArray.remove(idx);
                set({
                    selectedHosts: get().selectedHosts.filter(h => h.id !== hostId),
                });
            },
        })),
    );

    return (
        <ChainedHostsContext.Provider value={store}>
            {children}
        </ChainedHostsContext.Provider>
    );
};

export function useChainedHostsStore<T>(
    selector: (state: ChainedHostsStore) => T,
) {
    const store = useContext(ChainedHostsContext);
    if (!store) {
        throw new Error(
            "useChainedHostsStore must be used within a ChainedHostsProvider",
        );
    }
    return useStoreWithEqualityFn(store, selector);
}
