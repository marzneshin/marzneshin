
import { FC, useEffect, useState } from "react";
import {
    Tabs,
    TabsTrigger,
    TabsContent,
    FormLabel
} from '@marzneshin/components';
import { useTranslation } from 'react-i18next';
import {
    DataLimitField,
    DataLimitResetStrategyField,
} from "../fields";
import { TabsList } from "@radix-ui/react-tabs";
import { useFormContext } from 'react-hook-form';

export const DataLimitFields: FC = () => {
    const form = useFormContext()

    const { t } = useTranslation()
    const data_limit = form.watch().data_limit;

    const [
        selectedDataLimitTab,
        setSelectedDataLimitTab
    ] = useState((data_limit === 0) ? "unlimited" : "limited");

    useEffect(() => {
        setSelectedDataLimitTab((data_limit === 0) ? "unlimited" : "limited")
    }, [data_limit])

    useEffect(() => {
        if (selectedDataLimitTab !== 'limited') {
            form.setValue("data_limit", undefined)
            form.setValue("data_limit_reset_strategy", "no_reset");
        } 
        // eslint-disable-next-line
    }, [selectedDataLimitTab]);

    return (
        <>
            <FormLabel>
                {t('page.users.data_limit_method')}
            </FormLabel>
            <div className="flex gap-2 items-center w-full sm:flex-row md:flex-col">
                <Tabs defaultValue={selectedDataLimitTab} onValueChange={setSelectedDataLimitTab} className="mt-2 w-full">
                    <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
                        <TabsTrigger
                            className="w-full"
                            value="limited">
                            {t('page.users.limited')}
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full"
                            value="unlimited">
                            {t('page.users.unlimited')}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="limited">
                        <DataLimitField />
                        {form.watch().data_limit !== 0 && <DataLimitResetStrategyField />}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
