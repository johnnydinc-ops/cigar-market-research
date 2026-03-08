# @cigar/design

Design system for the cigar discovery + deal-finding product. Conventions: `docs/REPORT_DESIGN_GUIDELINES.md`, `docs/uiux/design_integration_checklist.md`.

## Contents

- **Tokens:** CSS variables in `styles.css` (import `@cigar/design/styles.css`).
- **Components:** `SearchEntry`, `RecommendationCard`, `DealComparisonTable`, `TrustBlock` (React).
- **Provenance:** `RecommendationCard` accepts `provenance?: ProvenanceRef[]` from `@cigar/core`.

## Usage

```tsx
import { SearchEntry, RecommendationCard, TrustBlock } from "@cigar/design";
import "@cigar/design/styles.css";
```

## Storybook

From repo root or this package:

```bash
npm run storybook -w @cigar/design
```

Stories: `Design/SearchEntry`, `Design/RecommendationCard`, `Design/DealComparisonTable`, `Design/TrustBlock`.  
Runs at http://localhost:6006.

## Definition of done (Stage 6)

See `docs/uiux/design_integration_checklist.md` §7. All core components implemented with props, provenance, tokens, and a11y; Storybook stories linked above.
