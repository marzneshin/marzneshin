import resolveConfig from "tailwindcss/resolveConfig";

//@ts-expect-error
import tailwindConfig from "@marzneshin/../tailwind.config.js";
import { useEffect, useState } from 'react';

const fullConfig = resolveConfig(tailwindConfig);
const {
    theme: { screens },
} = fullConfig;

export const useScreenBreakpoint = (query: keyof typeof screens): boolean => {
    const mediaQuery = `(min-width: ${screens[query]})`;
    const matchQueryList = window.matchMedia(mediaQuery);
    const [isMatch, setMatch] = useState<boolean>(false);
    const onChange = (e: MediaQueryListEvent) => setMatch(e.matches);
    useEffect(() => {
        setMatch(matchQueryList.matches);
        matchQueryList.addEventListener("change", onChange);
        return () => matchQueryList.removeEventListener("change", onChange);
    }, [query, matchQueryList]);
    return isMatch;
}
