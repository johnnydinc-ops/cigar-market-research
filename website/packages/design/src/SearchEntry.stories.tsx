import type { Meta, StoryObj } from "@storybook/react";
import { SearchEntry } from "./SearchEntry.js";

const meta: Meta<typeof SearchEntry> = {
  component: SearchEntry,
  title: "Design/SearchEntry",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SearchEntry>;

export const Default: Story = {
  args: {
    placeholder: "Enter a cigar you like (name or brand)",
    onSubmit: (q) => console.log("submit", q),
    ariaLabel: "Search for a cigar you like",
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
