# E2E tests (Playwright)

Full-length end-to-end tests: smoke, home, recommend, cigar detail, wishlist, profile, compliance, navigation.

## Run

From **repo root** (starts dev server if not already running):

```bash
npm run e2e
```

From this app:

```bash
cd website/apps/web && npm run e2e
```

- **Smoke:** Home load, search → recommend → detail, nav.
- **Home:** Title, trust copy, search form, empty submit, whitespace trim, TrustBlock.
- **Recommend:** No-query prompt, valid query results, cards, back link, error for unmatched query, add to wishlist, See best deal → detail.
- **Cigar detail:** Table load, columns, back link, add to wishlist, deal alert form, invalid id error, TrustBlock.
- **Wishlist:** Empty state, add from recommend, nav count, remove, “In wishlist” state.
- **Profile:** Taste preferences, strength/body dropdowns, TrustBlock.
- **Compliance:** Sections: we refer, affiliate, US only, privacy.
- **Navigation:** Nav on all pages, cigar detail nav, home link.

## Requirements

- Dev server for `@cigar/web` (port 3000). Playwright starts it automatically unless one is already running.
- Run with a single worker if the server is shared to avoid connection refused after long runs.
