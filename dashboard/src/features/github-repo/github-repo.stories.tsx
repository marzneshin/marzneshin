import { GithubRepo } from './index'
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GithubRepo> = {
    title: "Features/Github Repo Stats",
    component: GithubRepo,
    tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof GithubRepo>;

/**
 * Github repo present repo fullname, description, and repo stars.
 * */
export const GithubRepoStats: Story = {
    args: {
        full_name: "marzneshin/marzneshin",
        description: "Scalable and Comprehensive Backend Proxy Management",
        stargazers_count: 1000,
    }
}

/**
 * Mini variant of Github repo present repo only the github logo and stars.
 * */
export const GithubRepoStatsMini: Story = {
    args: {
        stargazers_count: 1000,
        variant: "mini"
    }
}

