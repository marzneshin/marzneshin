//@ts-expect-error
import create from "@kodingdotninja/use-tailwind-breakpoint";
import resolveConfig from "tailwindcss/resolveConfig";

//@ts-expect-error
import tailwindConfig from "@marzneshin/../tailwind.config.js";

const config = resolveConfig(tailwindConfig);

export const {
    useBreakpoint,
    useBreakpointEffect,
    useBreakpointValue
} = create(config.theme.screens);
