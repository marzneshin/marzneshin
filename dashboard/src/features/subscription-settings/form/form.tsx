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
} from "@marzneshin/components";
import { Schema } from "./schema"
import {
    UrlPrefixField,
    ProfileTitleField,
    SupportLinkField,
    UpdateIntervalField
} from "./fields";
import { NoRulesAlert } from "./no-rules-alert";
import {
    useSubscriptionSettingsQuery,
    useSubscriptionSettingsMutation,
} from "@marzneshin/features/subscription-settings";
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
                <UrlPrefixField />
                <ProfileTitleField />
                <SupportLinkField />
                <UpdateIntervalField />
                {fields.length === 0 && <NoRulesAlert />}
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
