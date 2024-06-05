import { SupportUsVariation } from './types'
import { useState, type Dispatch, type SetStateAction } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

export const useSupportUs = (
    variant: SupportUsVariation, defaultValue: boolean
): [boolean, Dispatch<SetStateAction<boolean>>] => {
    const [local, setLocal] = useLocalStorage<boolean>("marzneshin-support-us", defaultValue);
    const [state, setState] = useState<boolean>(defaultValue)
    return variant === "local-storage" ? [local, setLocal] : [state, setState]
}
