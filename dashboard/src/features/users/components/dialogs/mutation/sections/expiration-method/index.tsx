import { FC } from "react";
import {
    Tabs,
    TabsTrigger,
    TabsContent,
    FormLabel
} from '@marzneshin/components';
import {
    UserMutationType,
} from "@marzneshin/features/users";
import {
    ExpireDateField,
    OnHoldTimeoutField,
    OnHoldExpireDurationField,
} from "../../fields";
import { TabsList } from "@radix-ui/react-tabs";
import { useTranslation } from "react-i18next";
import { useExpirationMethodTabs } from "./use-expiration-method-tabs";

interface ExpirationMethodProps {
    entity: UserMutationType | null
}


export const ExpirationMethodFields: FC<ExpirationMethodProps> = ({ entity }) => {
    const { t } = useTranslation()
    const {
        setSelectedExpirationMethodTab,
        defaultExpirationMethodTab
    } = useExpirationMethodTabs({ entity })

    return (
        <>
            <FormLabel>
                {t('page.users.expire_method')}
            </FormLabel>
            <Tabs
                defaultValue={defaultExpirationMethodTab}
                onValueChange={setSelectedExpirationMethodTab}
                className="mt-2 w-full"
            >
                <TabsList className="flex flex-row items-center p-1 w-full rounded-md bg-accent">
                    <TabsTrigger
                        className="w-full"
                        value="determined">
                        {t('page.users.determined_expire')}
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="onhold">
                        {t('page.users.onhold_expire')}
                    </TabsTrigger>
                    <TabsTrigger
                        className="w-full"
                        value="unlimited">
                        {t('page.users.unlimited')}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="determined">
                    <ExpireDateField />
                </TabsContent>
                <TabsContent value="onhold">
                    <OnHoldExpireDurationField />
                    <OnHoldTimeoutField />
                </TabsContent>
            </Tabs>
        </>
    )
}
