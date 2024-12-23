import { Field } from "./dynamic-field.type";

export const transformToDictionary = (fields: Field[]) =>
    fields.reduce(
        (acc, field) => {
            if (field.name) acc[field.name] = field.value;
            return acc;
        },
        {} as { [key: string]: string },
    );
