import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { schema } from "./schema";
import { RuleItem } from "./rule-item";
import {
    HStack,
    Button,
    Form,
    Sortable,
    Alert,
    AlertDescription,
    AlertTitle,
    ScrollArea,
} from "@marzneshin/components";
import { Info } from 'lucide-react';
import { Schema } from "./schema"
import {
    UrlPrefixField,
    ProfileTitleField,
    SupportLinkField,
    UpdateIntervalField
} from "./fields";
import {
    useSubscriptionSettingsQuery,
    useSubscriptionSettingsMutation,
} from "@marzneshin/features/subscription-rules"
import {
    DevTool
} from "@hookform/devtools"
import { useEffect } from "react";

export function SubscriptionRulesForm() {
    const { t } = useTranslation()
    const { data } = useSubscriptionSettingsQuery()
    const subscriptionSettings = useSubscriptionSettingsMutation()
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: data,
    })

    useEffect(() => {
        if (data) {
            form.reset(data, {
                keepDirtyValues: true
            })
        }
    }, [data, form.reset])

    const onSubmit = (data: Schema) => {
        subscriptionSettings.mutate(data)
    }

    const { fields, append, move, remove } = useFieldArray({
        control: form.control,
        name: "rules"
    })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full max-w-4xl flex-col gap-2"
            >
                {fields.length === 0 && (
                    <Alert>
                        <Info className="mr-2" />
                        <AlertTitle className="font-semibold text-primary">{t('page.settings.subscription-rules.alert.title')}</AlertTitle>
                        <AlertDescription>
                            {t('page.settings.subscription-rules.alert.desc')}
                        </AlertDescription>
                    </Alert>
                )}
                <UrlPrefixField />
                <ProfileTitleField />
                <SupportLinkField />
                <UpdateIntervalField />
                <div className="space-y-1">
                    <Sortable
                        value={fields}
                        onMove={({ activeIndex, overIndex }) =>
                            move(activeIndex, overIndex)
                        }
                    >
                        <ScrollArea className="flex flex-col w-full max-h-[400px] gap-2" type="always">
                            {fields.map((field, index) => (
                                <RuleItem
                                    field={field}
                                    index={index}
                                    onRemove={remove} />
                            ))}
                        </ScrollArea>
                    </Sortable>
                </div>
                <HStack className="w-full flex-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
                        onClick={() =>
                            append({
                                pattern: "//",
                                result: "block",
                            })
                        }
                    >
                        {t("page.settings.subscription-rules.add-rule")}
                    </Button>
                    <Button type="submit" className="w-fit">
                        {t("submit")}
                    </Button>
                </HStack>
            </form>
            <DevTool control={form.control} />
        </Form>
    )
}
