import { Field } from "./dynamic-field.type";

export const transformToFields = (dictionary: {
    [key: string]: string;
}): Field[] =>
    Object.entries(dictionary).map(([name, value]) => ({ name, value }));
