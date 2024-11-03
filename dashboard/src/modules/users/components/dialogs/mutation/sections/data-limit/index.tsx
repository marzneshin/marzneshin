import { FC } from "react";
import { FormLabel, Switch } from '@marzneshin/common/components';
import { useTranslation } from 'react-i18next';
import { DataLimitField, DataLimitResetStrategyField } from "../../fields";
import { useDataLimit } from "./use-data-limit";

export const DataLimitFields: FC = () => {
    const { t } = useTranslation();
    const { isDataLimitEnabled, setIsDataLimitEnabled } = useDataLimit();

    return (
        <div className="my-2">
            <FormLabel className="hstack justify-between items-center text-md my-2" >
                {t('page.users.data_limit_method')}
                <Switch
                    checked={isDataLimitEnabled}
                    onCheckedChange={() => setIsDataLimitEnabled(!isDataLimitEnabled)}
                />
            </FormLabel>
            {isDataLimitEnabled && (
                <div className="flex gap-2 items-center w-full sm:flex-row md:flex-col">
                    <div className="flex gap-2 items-center w-full">
                        <DataLimitField />
                        <DataLimitResetStrategyField />
                    </div>
                </div>
            )}
        </div>
    );
};
