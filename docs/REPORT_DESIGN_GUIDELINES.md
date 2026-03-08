# Report Design Guidelines

Visual and UX standards for the polished web report. Goal: premium, credible, strategy-consulting / analyst-report feel; founder- and investor-readable.

---

## Overall Vibe

- **Understated, premium, professional**
- **White or light neutral background;** dark text
- **Restrained accent color** (e.g., single accent for links, key callouts, section markers)
- **No flashy startup aesthetic** — no gradients, no playful illustrations, no “growth hack” tone
- **Closer to:** analyst report, consulting memo, market intelligence portal (e.g., Gartner-style briefing, McKinsey-style deck)

---

## Typography

- **Headings:** Strong hierarchy (H1 → H2 → H3). Consider a distinctive but readable serif or sans (e.g., Chronicle, Source Serif, or a clean sans like DM Sans, Source Sans).
- **Body:** Highly readable serif or sans; 16–18px base on desktop; comfortable line height (1.5–1.65).
- **Avoid:** Inter, Roboto, Arial, generic “startup” fonts. Prefer one characterful display or heading font + one refined body font.
- **Consistency:** Same font pair across the report; clear scale (e.g., 1.25 or 1.333 ratio for heading sizes).

---

## Layout

- **Clean structure:** Clear section hierarchy; generous whitespace between sections.
- **Executive-summary-first:** Top of report or first nav item is Executive Summary.
- **Sidebar navigation:** Sticky or fixed sidebar with anchor links to sections for long-form reading.
- **Max width:** Cap line length (e.g., 65–75ch for body) for readability.
- **Cards/sections:** Use subtle borders or background tint to separate sections; avoid clutter.

---

## Components

- **Callout boxes:** For key findings, risks, and recommendations. Use a single accent color (e.g., muted blue or charcoal border) and optional icon. Label: “Key finding,” “Risk,” “Recommendation,” “Bull case,” “Bear case.”
- **Tables:** Clean borders or zebra striping; header row distinct; sortable if possible for competitor matrix.
- **Charts:** Use sparingly; prefer simple libraries (Chart.js, or CSS-only for simple bar/scorecard). No 3D or decorative charts.
- **Matrices / scorecards:** Where helpful (e.g., segment × value, competitor × feature). Keep legible; avoid too many dimensions.
- **Lists:** Use bullets or numbers consistently; avoid walls of text.

---

## Color

- **Background:** White (#fff) or very light neutral (#fafafa, #f5f5f4).
- **Text:** Dark gray or black (#1a1a1a, #333).
- **Accent:** One restrained color — e.g., navy (#1e3a5f), forest (#2d5016), or slate blue. Use for: links, key callout borders, section accents, buttons.
- **Secondary text:** Muted gray (#6b7280) for captions, metadata, “source” notes.
- **Avoid:** Bright purple, neon, multiple accent colors, heavy gradients.

---

## Content Rules

- **Facts vs. assumptions vs. inferences:** Label or separate (e.g., “Evidence:”, “Assumption:”, “Inference:”) where it matters for credibility.
- **Key takeaways:** Every major section should have 1–3 takeaway bullets or a short “Summary” at the end.
- **Bull / bear / recommendation:** In Executive Summary and Go/No-Go, clearly separate bull case, bear case, and final recommendation.
- **No hype:** Confident only when supported by evidence; “we don’t know” when we don’t.

---

## Responsiveness

- **Desktop-first** for report (long-form reading).
- **Responsive:** Sidebar can collapse to top nav or drawer on small screens; tables scroll horizontally or collapse to cards on mobile.
- **Print-friendly:** Consider print styles (hide nav, expand sections) for PDF export.

---

## Technical Notes for Implementation

- **Static or Next.js:** Either is fine. Static (Markdown → HTML or MDX) is simpler; Next.js allows dynamic nav and future CMS.
- **Markdown source:** All section content from `docs/*.md`; parse and render with consistent styling.
- **Data:** Competitor matrix from `data/competitor_matrix.csv`; render as table or simple chart.
- **Charts:** Optional — e.g., market size bar, segment size, competitor 2×2. Prefer simple and legible over fancy.
- **Navigation:** Sidebar with anchor links; current section highlighted; smooth scroll.

---

## Checklist for “Premium Report” Feel

- [ ] Executive summary is first and concise
- [ ] Section hierarchy is obvious (H1 > H2 > H3)
- [ ] Key findings and recommendations in callout boxes
- [ ] Tables are clean and scannable
- [ ] One accent color used consistently
- [ ] No flashy or playful visuals
- [ ] Bull / bear / recommendation clearly stated
- [ ] Facts and assumptions distinguished where relevant
- [ ] Sidebar or TOC for navigation
- [ ] Responsive and (if possible) print-friendly
