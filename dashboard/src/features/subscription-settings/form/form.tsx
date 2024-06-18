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
    ScrollArea,
    FormLabel,
    Separator,
} from "@marzneshin/components";
import { Schema } from "./schema"
import {
    TemplateOnAcceptanceField,
    ProfileTitleField,
    SupportLinkField,
    UpdateIntervalField
} from "./fields";
import { NoRulesAlert } from "./no-rules-alert";
import {
    useSubscriptionSettingsQuery,
    useSubscriptionSettingsMutation,
} from "@marzneshin/features/subscription-settings";
import { useEffect, useCallback } from "react";

export function SubscriptionRulesForm() {
    const { t } = useTranslation()
    const { data } = useSubscriptionSettingsQuery()
    const subscriptionSettings = useSubscriptionSettingsMutation()
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: data,
    })

    const handleSubscriptionRulesDataUpdate = useCallback(
        () => {
            form.reset(data, {
                keepDirtyValues: true
            })
        },
        [form, data],
    )

    useEffect(() => {
        if (data) {
            handleSubscriptionRulesDataUpdate()
        }
    }, [data, handleSubscriptionRulesDataUpdate])

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
                <ProfileTitleField />
                <div className="md:grid grid-cols-2 gap-2 flex flex-col">
                    <UpdateIntervalField />
                    <SupportLinkField />
                </div>
                <TemplateOnAcceptanceField />
                <Separator className="my-3" />
                <h4 className="text-lg mt-2">
                    {t("page.settings.subscription-settings.subscription-title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                    {t("page.settings.subscription-settings.subscription-desc")}
                </p>
                {fields.length === 0 ? <NoRulesAlert /> : (
                    <div className="space-y-1">
                        <Sortable
                            value={fields}
                            onMove={({ activeIndex, overIndex }) =>
                                move(activeIndex, overIndex)
                            }
                        >
                            <div className="grid grid-cols-[2fr,1.3fr,0.25fr,0.25fr] items-center justify-start gap-2 my-2">
                                <FormLabel>
                                    {t("pattern")}
                                </FormLabel>
                                <FormLabel>
                                    {t("result")}
                                </FormLabel>
                            </div>
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
                )}
                <HStack className="w-full flex-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-fit"
                        onClick={() =>
                            append({
                                pattern: "",
                                result: "block",
                            })
                        }
                    >
                        {t("page.settings.subscription-settings.add-rule")}
                    </Button>
                    <Button type="submit" className="w-fit">
                        {t("submit")}
                    </Button>
                </HStack>
            </form>
        </Form>
    )
}
