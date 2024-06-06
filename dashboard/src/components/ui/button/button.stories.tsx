import { Button } from './index'
import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";


const meta: Meta<typeof Button> = {
    title: "Components/UI/Button",
    component: Button,
    tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof Button>;


export const Primary: Story = {
    args: {
        variant: "default",
        size: "default",
        onMouseDown: action('clicked'),
        children: 'Primary'
    }
}

export const Secondary: Story = {
    args: {
        onMouseDown: action('clicked'),
        variant: 'secondary',
        children: 'Secondary'
    }
}

export const Destructive: Story = {
    args: {
        onMouseDown: action('clicked'),
        variant: 'destructive',
        children: 'Destructive'
    }
}

export const Success: Story = {
    args: {
        onMouseDown: action('clicked'),
        variant: 'success',
        children: 'Success'
    }
}

export const Ghost: Story = {
    args: {
        onMouseDown: action('clicked'),
        variant: 'ghost',
        children: 'Ghost'
    }
}

export const Link: Story = {
    args: {
        onMouseDown: action('clicked'),
        variant: 'link',
        children: 'Ghost'
    }
}

export const SmallSize: Story = {
    args: {
        onMouseDown: action('clicked'),
        children: 'Small',
        size: 'sm'
    }
}

export const DefaultSize: Story = {
    args: {
        onMouseDown: action('clicked'),
        children: 'Default',
        size: 'sm'
    }
}

export const LargeSize: Story = {
    args: {
        onMouseDown: action('clicked'),
        children: 'Large',
        size: 'lg'
    }
}

export const IconSize: Story = {
    args: {
        onMouseDown: action('clicked'),
        children: 'I',
        size: 'icon'
    }
}

