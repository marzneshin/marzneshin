import { Button } from './index'
import { action } from "@storybook/addon-actions";

export default {
    title: "Components/UI/Button",
    component: Button,
};

const Template = args => <Button {...args} />


export const Primary = Template.bind({})
Primary.args = {
    onMouseDown: action('clicked'),
    children: 'Primary'
}

export const Secondary = Template.bind({})
Secondary.args = {
    onMouseDown: action('clicked'),
    variant: 'secondary',
    children: 'Secondary'
}

export const Destructive = Template.bind({})
Destructive.args = {
    onMouseDown: action('clicked'),
    variant: 'destructive',
    children: 'Destructive'
}

export const Success = Template.bind({})
Success.args = {
    onMouseDown: action('clicked'),
    variant: 'success',
    children: 'Success'
}


export const Ghost = Template.bind({})
Ghost.args = {
    onMouseDown: action('clicked'),
    variant: 'ghost',
    children: 'Ghost'
}

export const Link = Template.bind({})
Link.args = {
    onMouseDown: action('clicked'),
    variant: 'link',
    children: 'Ghost'
}

export const SmallSize = Template.bind({})
SmallSize.args = {
    onMouseDown: action('clicked'),
    children: 'Small',
    size: 'sm'
}

export const DefaultSize = Template.bind({})
DefaultSize.args = {
    onMouseDown: action('clicked'),
    children: 'Default',
    size: 'sm'
}

export const LargeSize = Template.bind({})
LargeSize.args = {
    onMouseDown: action('clicked'),
    children: 'Large',
    size: 'lg'
}

export const IconSize = Template.bind({})
IconSize.args = {
    onMouseDown: action('clicked'),
    children: 'I',
    size: 'icon'
}

