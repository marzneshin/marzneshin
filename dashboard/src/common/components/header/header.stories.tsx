import { HeaderMenu, Header } from ".";
import { CommandBox } from "@marzneshin/features/search-command";
import { HeaderLogo } from "@marzneshin/common/components";
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

const HeaderMenuComponent = HeaderMenu as React.FC<unknown>

const meta: Meta<typeof Header> = {
    title: "Components/Header",
    component: Header,
    tags: ["autodocs"],
    subcomponents: { HeaderMenuComponent }
};

export default meta;

type Story = StoryObj<typeof Header>;


export const HeaderAnatomy: Story = {
    args: {
        start: <h1>Start section</h1>,
        center: <h1>Center section</h1>,
        end: <h1>End section</h1>
    }
}

export const HeaderWithMenu: Story = {
    args: {
        start: <h1>Start section</h1>,
        center: <h1>Center section</h1>,
        end: <HeaderMenu />
    }
}


export const DashoardHeader: Story = {
    args: {
        start: <HeaderLogo />,
        center: <CommandBox />,
        end: <HeaderMenu />
    }
}
