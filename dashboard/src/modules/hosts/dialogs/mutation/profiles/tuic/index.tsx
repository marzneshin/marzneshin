import {
    CommonFields,
} from "../../fields";
import {
    TlsFields
} from "../../sections";

export const TuicProfileFields = () => {
    return (
        <>
            <CommonFields />
            <TlsFields />
        </>
    )
}

export * from "./schema";
