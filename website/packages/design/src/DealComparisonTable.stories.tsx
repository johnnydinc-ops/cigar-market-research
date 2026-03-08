import type { Meta, StoryObj } from "@storybook/react";
import { DealComparisonTable } from "./DealComparisonTable.js";

const meta: Meta<typeof DealComparisonTable> = {
  component: DealComparisonTable,
  title: "Design/DealComparisonTable",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DealComparisonTable>;

const sampleRows = [
  {
    retailerId: "r1",
    retailerName: "Famous Smoke",
    priceCents: 1299,
    perStickCents: 650,
    freshnessLabel: "fresh",
    ctaUrl: "#",
    ctaLabel: "Shop",
  },
  {
    retailerId: "r2",
    retailerName: "Cigars International",
    priceCents: 1349,
    perStickCents: 675,
    freshnessLabel: "recent",
    ctaUrl: "#",
    ctaLabel: "Shop",
  },
  {
    retailerId: "r3",
    retailerName: "JR Cigar",
    priceCents: 1399,
    perStickCents: 700,
    freshnessLabel: "stale",
    ctaUrl: "#",
    ctaLabel: "Shop",
  },
];

export const Default: Story = {
  args: {
    rows: sampleRows,
    productTitle: "Padrón 1964 Anniversary Principe (Box of 20)",
    sortBy: "price",
  },
};
