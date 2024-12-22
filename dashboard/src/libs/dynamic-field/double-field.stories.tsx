import DynamicForm from "./dynamic-form";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent, expect } from "@storybook/test";

const meta: Meta<typeof DynamicForm> = {
    title: "Libs/Dynamic Form",
    component: DynamicForm,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DynamicForm>;

/**
 * Basic implementation of the dynamic form that allows adding and removing field pairs.
 */
export const Default: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        
        // Click add field button
        const addButton = canvas.getByText('Add Field');
        await userEvent.click(addButton);
        
        // Fill in the fields
        const nameInput = canvas.getByPlaceholderText('Field Name');
        const valueInput = canvas.getByPlaceholderText('Field Value');
        
        await userEvent.type(nameInput, 'testKey');
        await userEvent.type(valueInput, 'testValue');
        
        // Verify inputs
        await expect(nameInput).toHaveValue('testKey');
        await expect(valueInput).toHaveValue('testValue');
    },
};

/**
 * Shows how multiple fields can be added and removed.
 */
export const MultipleFields: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        
        // Add three fields
        const addButton = canvas.getByText('Add Field');
        for (let i = 0; i < 3; i++) {
            await userEvent.click(addButton);
        }
        
        // Verify three field pairs were created
        const nameInputs = canvas.getAllByPlaceholderText('Field Name');
        expect(nameInputs).toHaveLength(3);
    },
};
