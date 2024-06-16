import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export const useDataLimitTabs = () => {
    const form = useFormContext();
    const data_limit = form.watch("data_limit");

    const [selectedDataLimitTab, setSelectedDataLimitTab] = useState(data_limit === 0 ? "unlimited" : "limited");

    useEffect(() => {
        setSelectedDataLimitTab(data_limit === 0 ? "unlimited" : "limited");
    }, [data_limit]);

    useEffect(() => {
        if (selectedDataLimitTab !== "limited") {
            form.setValue("data_limit", undefined);
            form.setValue("data_limit_reset_strategy", "no_reset");
        }
    }, [selectedDataLimitTab, form]);

    return { selectedDataLimitTab, setSelectedDataLimitTab };
};

