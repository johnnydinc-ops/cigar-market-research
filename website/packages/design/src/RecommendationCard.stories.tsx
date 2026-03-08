import type { Meta, StoryObj } from "@storybook/react";
import { RecommendationCard } from "./RecommendationCard.js";

const meta: Meta<typeof RecommendationCard> = {
  component: RecommendationCard,
  title: "Design/RecommendationCard",
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof RecommendationCard>;

export const Default: Story = {
  args: {
    title: "Padrón 1964 Anniversary Series Principe",
    explanation: "Similar strength and body; same wrapper family. Often recommended for fans of medium-full cigars with aged Nicaraguan tobacco.",
    bestPrice: { amountCents: 1299, retailerName: "Famous Smoke" },
    ctaLabel: "See best deal",
    ctaHref: "#",
    attributes: { strength: "Medium-Full", body: "Full", wrapper: "Maduro" },
  },
};

export const WithProvenance: Story = {
  args: {
    ...Default.args,
    provenance: [
      {
        documentId: "doc-1",
        attribution: "Halfwheel review (2024)",
        snippet: "Rich, cedary, with cocoa and espresso.",
        citationUrl: "https://halfwheel.com/example",
      },
    ],
  },
};

export const FromPriceOnly: Story = {
  args: {
    title: "Oliva Serie V Melanio",
    fromPrice: 899,
    retailerCount: 12,
    ctaLabel: "Compare prices",
    ctaHref: "#",
  },
};
