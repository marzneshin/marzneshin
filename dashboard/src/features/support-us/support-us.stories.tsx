import { SupportUs } from "@marzneshin/features/support-us";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from '@storybook/test';

const meta: Meta<typeof SupportUs> = {
    title: "Features/Support Us",
    component: SupportUs,
    tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SupportUs>;
const donationLink = "https://localhost.com/donation";

/**
 * This variation does not provide X button to close the card.
 * */
export const View: Story = {
    args: {
        open: true,
        variant: "view",
        donationLink
    }
}

/**
 * This variation does provide X button to close the card. However,
 * the card will not be restored incase the component is refersh. Since
 * its using browser local storage.
 * */
export const LocalStorage: Story = {
    args: {
        open: true,
        variant: "local-storage",
        donationLink

    }
}


/**
 * This variation does provide X button to close the card. However,
 * the card will be restored incase the component is refersh.
 * */
export const Status: Story = {
    args: {
        open: true,
        variant: "status",
        donationLink
    }
}

Status.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check if the component is rendered
    await expect(canvas.getByText(/Support Us/i)).toBeInTheDocument();

    // Check the Donation link
    const donationLinkButton = canvas.getByRole('link', { name: /donate/i });
    await expect(donationLinkButton).toHaveAttribute('href', donationLink);

    // Simulate closing the support card
    const closeButton = canvas.getByRole('button', { name: /Close/i });
    await userEvent.click(closeButton);

    // Check if the component is removed from the DOM
    expect(canvas.queryByText(/Support Us/i)).not.toBeInTheDocument();
};
