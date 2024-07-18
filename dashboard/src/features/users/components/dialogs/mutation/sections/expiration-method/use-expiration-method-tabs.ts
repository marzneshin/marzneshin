import { UserMutationType, ExpireStrategy } from "@marzneshin/features/users";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { strategies } from "./expiration-method.strategy"


export const useExpirationMethodTabs = ({ entity }: { entity: UserMutationType | null }) => {
    const form = useFormContext();

    const defaultExpirationMethodTab = entity ? entity.expire_strategy : 'fixed_date';
    const [selectedExpirationMethodTab, setSelectedExpirationMethodTab] = useState<ExpireStrategy>(defaultExpirationMethodTab);

    useEffect(() => {
        strategies[selectedExpirationMethodTab as ExpireStrategy].apply(form);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExpirationMethodTab]);

    const handleTabChange = (value: string) => {
        setSelectedExpirationMethodTab(value as ExpireStrategy);
    };

    return {
        selectedExpirationMethodTab: selectedExpirationMethodTab,
        defaultExpirationMethodTab,
        setSelectedExpirationMethodTab,
        handleTabChange,
    };
};
