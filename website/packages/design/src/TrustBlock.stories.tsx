import type { Meta, StoryObj } from "@storybook/react";
import { TrustBlock } from "./TrustBlock.js";

const meta: Meta<typeof TrustBlock> = {
  component: TrustBlock,
  title: "Design/TrustBlock",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TrustBlock>;

export const Default: Story = {
  args: {
    disclaimer: "We don't sell cigars; we refer you to retailers.",
    retailerCount: 17,
    lastUpdatedLabel: "Prices updated daily.",
    methodologyHref: "#",
  },
};

export const Minimal: Story = {
  args: {
    disclaimer: "We don't sell cigars; we refer you to retailers.",
  },
};
