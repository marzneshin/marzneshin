import { SupportUs } from './index'
import { action } from "@storybook/addon-actions";

export default {
    title: 'Components/Support Us',
    component: SupportUs
}


const Template = args => <SupportUs {...args} />


export const Primary = Template.bind({})
Primary.args = {
    onMouseDown: action('clicked'),
    children: 'Primary'
}

