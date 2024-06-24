import { UserMutationType } from "@marzneshin/features/users";
import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ExpirationMethod } from "./expiration-method.type"
import { strategies } from "./expiration-method.strategy"


const getUserExpirationMethod = (entity: UserMutationType): ExpirationMethod => {
    if (entity.status === "on_hold") return 'onhold';
    if (entity.expire != null) return 'determined';
    return 'unlimited';
};

export const useExpirationMethodTabs = ({ entity }: { entity: UserMutationType | null }) => {
    const form = useFormContext();

    const defaultExpirationMethodTab = entity ? getUserExpirationMethod(entity) : 'determined';
    const [selectedExpirationMethodTab, setSelectedExpirationMethodTab] = useState<ExpirationMethod>(defaultExpirationMethodTab);

    useEffect(() => {
        strategies[selectedExpirationMethodTab].apply(form);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedExpirationMethodTab]);

    return {
        selectedExpirationMethodTab: selectedExpirationMethodTab,
        defaultExpirationMethodTab,
        setSelectedExpirationMethodTab,
    };
};
