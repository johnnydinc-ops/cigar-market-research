# Design system integration checklist (Stage 5)

**In brief:** Required components, props, and provenance behavior so that `packages/design` (Stage 6) can implement the product wedge without re-specifying UX. Satisfying this checklist is required before design system implementation is considered complete for MVP.

---

## 1. Core components to implement

| Component | Purpose | Source |
|-----------|---------|--------|
| **SearchEntry** | Single primary search for "cigar you like"; drives recommend flow | pattern_library §1 |
| **RecommendationCard** | One recommended cigar: title, explanation, price/deal CTA, optional attributes & provenance | pattern_library §2 |
| **DealComparisonTable** | Multi-retailer price comparison; sortable; CTA per row | pattern_library §3 |
| **TrustBlock** | Short trust copy (we refer; retailers; freshness) | pattern_library §4 |

Optional for MVP but recommended: **DealRow** (mobile variant of comparison row), **ProvenanceTooltip** or inline expansion for "why recommended" detail.

---

## 2. Props and data contracts

### SearchEntry

- `placeholder: string`
- `onSubmit: (query: string) => void`
- `disabled?: boolean`
- `ariaLabel?: string` (default: search purpose)

### RecommendationCard

- `title: string` (e.g. brand + product name)
- `explanation?: string` (short "why" copy)
- `provenance?: ProvenanceRef[]` (see §3; from `@cigar/core`)
- `bestPrice?: { amountCents: number; retailerName: string }` or `fromPrice?: number`
- `retailerCount?: number`
- `ctaLabel?: string` (e.g. "See best deal")
- `onCtaClick?: () => void` or `ctaHref?: string`
- `attributes?: { strength?: string; body?: string; wrapper?: string }` (optional pills)
- `imageUrl?: string` (optional)

### DealComparisonTable

- `rows: Array<{ retailerId: string; retailerName: string; priceCents: number; perStickCents?: number; freshnessLabel?: string; ctaUrl: string; ctaLabel?: string }>`
- `sortBy?: 'price' | 'freshness'`
- `productTitle?: string` (for heading)
- Accessible: sort controls, table headers, row links/buttons

### TrustBlock

- `retailerCount?: number`
- `disclaimer: string` (e.g. "We don't sell cigars; we refer you to retailers.")
- `methodologyHref?: string`
- `lastUpdatedLabel?: string` (e.g. "Prices updated daily.")

---

## 3. Provenance requirements

Recommendation explanations may be backed by RAG, attribute similarity, or editorial. The design system must support:

- **ProvenanceRef** (from `@cigar/core` recommendation types): `{ documentId: string; citationUrl?: string; attribution?: string; snippet?: string }`. Design can treat `attribution` as source label and `citationUrl` as link.
- **RecommendationCard** must render:
  - `explanation` as primary short copy.
  - If `provenance` is present: optional secondary UI (e.g. "Based on: [attribution]" or expandable snippet); no requirement to show full snippet in card, but link or expand for transparency.
- **Accessibility:** Provenance source and snippet must be available to screen readers (e.g. in expandable section or tooltip).

Design system must not assume a single recommendation backend; props are backend-agnostic (string explanation + optional provenance object).

---

## 4. Theming and tokens

- Follow **docs/REPORT_DESIGN_GUIDELINES.md**: restrained accent, readable type, clear hierarchy.
- Use `packages/design` tokens for: primary text, secondary text, accent, background, borders, focus ring.
- **TrustBlock:** Muted, secondary styling (not competing with primary CTAs).

---

## 5. Accessibility checklist

- [ ] SearchEntry: visible label or aria-label; submit on Enter; focus visible.
- [ ] RecommendationCard: CTA is button or link; card is keyboard navigable; explanation and provenance available to AT.
- [ ] DealComparisonTable: proper table semantics; sort state announced; CTAs per row.
- [ ] TrustBlock: readable contrast; link to methodology focusable.

---

## 6. Integration with app and core

- **apps/web:** Consumes `@cigar/design` components; passes data from `@cigar/core` (recommendation, bestDealEngine) into component props.
- **ProvenanceRef:** Import from `@cigar/core`; design components accept and display only; no core logic in design package.
- **Instrumentation:** Clicks on recommendation CTAs and deal CTAs must be instrumented in app layer (query → recommendation → best deal → affiliate click); design components expose `onCtaClick` or use links that app can decorate.

---

## 7. Definition of "done" for Stage 6

- [ ] All components in §1 implemented in `packages/design` with props above.
- [ ] Provenance (§3) supported in RecommendationCard.
- [ ] Tokens and REPORT_DESIGN_GUIDELINES applied.
- [ ] Accessibility checklist (§5) satisfied.
- [ ] Storybook (or equivalent) stories for each component; linked from this doc or README in `packages/design`.

---

*Checklist v1. Update when new patterns or provenance kinds are added.*
