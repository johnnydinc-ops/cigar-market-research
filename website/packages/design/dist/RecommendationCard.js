"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationCard = RecommendationCard;
const jsx_runtime_1 = require("react/jsx-runtime");
function formatCents(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}
function RecommendationCard({ title, explanation, provenance, bestPrice, fromPrice, retailerCount, ctaLabel = "See best deal", onCtaClick, ctaHref, attributes, imageUrl, }) {
    const priceLine = bestPrice != null
        ? `${formatCents(bestPrice.amountCents)} at ${bestPrice.retailerName}`
        : fromPrice != null
            ? `From ${formatCents(fromPrice)}`
            : retailerCount != null
                ? `${retailerCount} retailer${retailerCount !== 1 ? "s" : ""}`
                : null;
    const cta = ctaHref != null ? ((0, jsx_runtime_1.jsx)("a", { href: ctaHref, className: "cigar-recommendation-card__cta", onClick: onCtaClick, rel: "noopener noreferrer", target: "_blank", children: ctaLabel })) : ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "cigar-recommendation-card__cta", onClick: onCtaClick, children: ctaLabel }));
    return ((0, jsx_runtime_1.jsxs)("article", { className: "cigar-recommendation-card", children: [imageUrl != null && ((0, jsx_runtime_1.jsx)("img", { src: imageUrl, alt: "", className: "cigar-recommendation-card__img", width: 120, height: 120 })), (0, jsx_runtime_1.jsx)("h3", { className: "cigar-recommendation-card__title", children: title }), explanation != null && ((0, jsx_runtime_1.jsx)("p", { className: "cigar-recommendation-card__explanation", children: explanation })), provenance != null && provenance.length > 0 && ((0, jsx_runtime_1.jsxs)("details", { className: "cigar-recommendation-card__provenance", children: [(0, jsx_runtime_1.jsxs)("summary", { children: ["Based on: ", provenance[0].attribution ?? "source"] }), (0, jsx_runtime_1.jsx)("ul", { "aria-label": "Provenance sources", children: provenance.map((p, i) => ((0, jsx_runtime_1.jsxs)("li", { children: [p.attribution != null && (0, jsx_runtime_1.jsx)("span", { children: p.attribution }), p.snippet != null && ((0, jsx_runtime_1.jsx)("blockquote", { cite: p.citationUrl, children: p.snippet })), p.citationUrl != null && ((0, jsx_runtime_1.jsx)("a", { href: p.citationUrl, target: "_blank", rel: "noopener noreferrer", children: "Source" }))] }, p.documentId ?? i))) })] })), attributes != null && (attributes.strength ?? attributes.body ?? attributes.wrapper) && ((0, jsx_runtime_1.jsxs)("div", { className: "cigar-recommendation-card__attributes", children: [attributes.strength != null && ((0, jsx_runtime_1.jsx)("span", { className: "cigar-recommendation-card__pill", children: attributes.strength })), attributes.body != null && ((0, jsx_runtime_1.jsx)("span", { className: "cigar-recommendation-card__pill", children: attributes.body })), attributes.wrapper != null && ((0, jsx_runtime_1.jsx)("span", { className: "cigar-recommendation-card__pill", children: attributes.wrapper }))] })), priceLine != null && ((0, jsx_runtime_1.jsx)("p", { className: "cigar-recommendation-card__price", children: priceLine })), cta] }));
}
//# sourceMappingURL=RecommendationCard.js.map