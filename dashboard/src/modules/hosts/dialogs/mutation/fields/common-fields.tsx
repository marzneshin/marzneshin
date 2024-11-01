import {
    HStack,
} from "@marzneshin/components";
import {
    RemarkField,
    AddressField,
    PortField,
} from ".";

export const CommonFields = () => (
    <>
        <RemarkField />
        <HStack className="gap-2 items-start">
            <AddressField />
            <PortField />
        </HStack>
    </>
)
