import { FC } from "react";
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
} from "../../fields";
import { TabsList } from "@radix-ui/react-tabs";
import { useFormContext } from "react-hook-form";
import { useDataLimitTabs } from "./use-data-limit-tabs";

export const DataLimitFields: FC = () => {
    const { t } = useTranslation();
    const { selectedDataLimitTab, setSelectedDataLimitTab } = useDataLimitTabs();
    const form = useFormContext();

    return (
        <>
            <FormLabel>
                {t('page.users.data_limit_method')}
            </FormLabel>
            <div className="flex gap-2 items-center w-full sm:flex-row md:flex-col">
                <Tabs
                    defaultValue={selectedDataLimitTab}
                    onValueChange={setSelectedDataLimitTab}
                    className="mt-2 w-full"
                >
                    <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
                        <TabsTrigger
                            className="w-full"
                            value="limited"
                        >
                            {t('page.users.limited')}
                        </TabsTrigger>
                        <TabsTrigger
                            className="w-full"
                            value="unlimited"
                        >
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
    );
};
