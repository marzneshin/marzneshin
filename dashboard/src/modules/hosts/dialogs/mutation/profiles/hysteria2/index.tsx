import {
    CommonFields,
    PathField,
} from "../../fields";
import {
    TlsFields
} from "../../sections";
import {
    Accordion,
} from "@marzneshin/components";

export const Hysteria2ProfileFields = () => {
    return (
        <div className="space-y-2">
            <CommonFields />
            <PathField />
            <Accordion className="space-y-2" type="single" collapsible>
                <TlsFields />
            </Accordion>
        </div>
    )
}

export * from "./schema";
export * from "./default";
