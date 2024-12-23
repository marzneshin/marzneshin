import {
    AlertCard,
    Button,
    FormLabel,
    ScrollArea,
} from "@marzneshin/common/components";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DynamicField } from "@marzneshin/libs/dynamic-field";
import { useTranslation } from "react-i18next";
import { ListPlus, Trash } from "lucide-react";

// TODO: Default back to previous value
// TODO: Push up animation for adding new headers
// TODO: Remove animation for removing previous headers

export const HttpHeadersDynamicFields = () => {
    const { t } = useTranslation();
    const { control } = useFormContext();

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: "http_headers",
    });

    return (
        <div className="mt-2 flex flex-col gap-2">
            <FormLabel className="hstack justify-between items-center">
                {t("page.hosts.http_headers")}
                <div className="hstack gap-1 items-center [*>button]:p-1">
                    <Button
                        variant="secondary-destructive"
                        size="icon"
                        disabled={!fields.length}
                        className="p-1"
                        onClick={() => replace([])}
                    >
                        <Trash />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="p-1"
                        onClick={(e) => {
                            e.preventDefault();
                            append({ name: "", value: "" });
                        }}
                    >
                        <ListPlus />
                    </Button>
                </div>
            </FormLabel>
            <ScrollArea className="p-2 border-2  h-[7rem] max-h-[10rem]  bg-background grid grid-cols-1 gap-2 rounded-md">
                {fields.length !== 0 ? (
                    fields.map((field, index) => (
                        <DynamicField
                            key={field.id}
                            fieldIndex={index}
                            parentFieldName="http_headers"
                            onRemove={() => remove(index)}
                        />
                    ))
                ) : (
                    <AlertCard
                        size="wide-full"
                        title={t("page.hosts.no-http-headers")}
                    ></AlertCard>
                )}
            </ScrollArea>
        </div>
    );
};
