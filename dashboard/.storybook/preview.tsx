import React from "react";
import type { Preview } from "@storybook/react";
import { TooltipProvider } from "../src/common/components";
import { ThemeProvider } from "../src/features/theme-switch";
import { queryClient } from "../src/common/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';
import i18n from "../src/features/i18n";

import "./../src/globals.css";

const preview: Preview = {
    decorators: [
        (Story) => (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                    <TooltipProvider>
                        <I18nextProvider i18n={i18n}>
                            <Story />
                        </I18nextProvider>
                    </TooltipProvider>
                </ThemeProvider>
            </QueryClientProvider>
        ),
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        docs: {
            page: () => (
                <>
                    <Title />
                    <Subtitle />
                    <Description />
                    <Primary />
                    <Controls />
                    <Stories />
                </>
            ),
        },
    },
}

export default preview;
