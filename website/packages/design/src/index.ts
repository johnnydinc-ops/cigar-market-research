/**
 * Design system — docs/REPORT_DESIGN_GUIDELINES.md, docs/uiux/design_integration_checklist.md.
 */

export const designTokens = {
  colors: {
    bg: "var(--bg)",
    bgCard: "var(--bg-card)",
    text: "var(--text)",
    textMuted: "var(--text-muted)",
    accent: "var(--accent)",
    accentMuted: "var(--accent-muted)",
    border: "var(--border)",
  },
  fonts: {
    sans: "var(--font-sans)",
    serif: "var(--font-serif)",
  },
} as const;

export { SearchEntry } from "./SearchEntry.js";
export type { SearchEntryProps } from "./SearchEntry.js";
export { RecommendationCard } from "./RecommendationCard.js";
export type { RecommendationCardProps } from "./RecommendationCard.js";
export { DealComparisonTable } from "./DealComparisonTable.js";
export type { DealComparisonTableProps, DealComparisonRow } from "./DealComparisonTable.js";
export { TrustBlock } from "./TrustBlock.js";
export type { TrustBlockProps } from "./TrustBlock.js";
