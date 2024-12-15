import {
    CommonFields,
} from "../../fields";
import {
    TlsFields
} from "../../sections";
import {
    Accordion,
} from "@marzneshin/common/components";

export const TuicProfileFields = () => {
    return (
        <div className="space-y-2">
            <CommonFields />
            <Accordion className="space-y-2" type="single" collapsible>
                <TlsFields />
            </Accordion>
        </div>
    )
}

export * from "./schema";
export * from "./default";
