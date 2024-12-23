import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input, Button, Separator } from "@marzneshin/common/components";
import { ListX } from "lucide-react";

interface DynamicFieldProps {
    fieldIndex: number;
    parentFieldName: string;
    onRemove: () => void;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
    fieldIndex,
    parentFieldName,
    onRemove,
}) => {
    const { control } = useFormContext();

    return (
        <div className="hstack gap-2 mt-1">
            <div className="hstack gap-0 items-center border-ghost border-2 rounded-md">
                <Controller
                    name={`${parentFieldName}.${fieldIndex}.name`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            className="border-none bg-transparent w-2/5 focus-visible:ring-offset-0 focus-visible:ring-0 text-end"
                            placeholder="Header Name"
                        />
                    )}
                />
                <Separator className="h-2/4" orientation="vertical" />
                <Controller
                    name={`${parentFieldName}.${fieldIndex}.value`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            className="border-none bg-transparent w-3/5 focus-visible:ring-0 focus-visible:ring-offset-0 text-start"
                            placeholder="Header Value"
                        />
                    )}
                />
            </div>
            <Button
                variant="secondary-destructive"
                size="icon"
                onClick={onRemove}
            >
                <ListX />
            </Button>
        </div>
    );
};
