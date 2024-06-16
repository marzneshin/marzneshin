import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export const useDataLimit = () => {
    const form = useFormContext();
    const data_limit = form.watch("data_limit");

    const [isDataLimitEnabled, setIsDataLimitEnabled] = useState(data_limit !== 0);

    useEffect(() => {
        setIsDataLimitEnabled(data_limit !== 0);
    }, [data_limit]);

    useEffect(() => {
        if (!isDataLimitEnabled) {
            form.setValue("data_limit", 0);
            form.setValue("data_limit_reset_strategy", "no_reset");
        }
    }, [isDataLimitEnabled, form]);

    return { isDataLimitEnabled, setIsDataLimitEnabled };
};
