"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealComparisonTable = DealComparisonTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
function formatCents(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}
function DealComparisonTable({ rows, sortBy: initialSort = "price", productTitle, }) {
    const [sortKey, setSortKey] = (0, react_1.useState)(initialSort);
    const sortedRows = (0, react_1.useMemo)(() => {
        const copy = [...rows];
        if (sortKey === "price") {
            copy.sort((a, b) => a.priceCents - b.priceCents);
        }
        else {
            const order = (l) => (l === "fresh" ? 0 : l === "recent" ? 1 : 2);
            copy.sort((a, b) => order((a.freshnessLabel ?? "").toLowerCase()) -
                order((b.freshnessLabel ?? "").toLowerCase()));
        }
        return copy;
    }, [rows, sortKey]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "cigar-deal-table-wrap", children: [productTitle != null && ((0, jsx_runtime_1.jsx)("h2", { className: "cigar-deal-table-title", children: productTitle })), (0, jsx_runtime_1.jsxs)("table", { className: "cigar-deal-table", role: "table", "aria-label": "Price comparison by retailer", children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { scope: "col", children: "Retailer" }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "cigar-deal-table__sort", onClick: () => setSortKey("price"), "aria-pressed": sortKey === "price", "aria-label": "Sort by price", children: ["Price ", sortKey === "price" ? "▼" : ""] }) }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: "Per stick" }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: (0, jsx_runtime_1.jsxs)("button", { type: "button", className: "cigar-deal-table__sort", onClick: () => setSortKey("freshness"), "aria-pressed": sortKey === "freshness", "aria-label": "Sort by freshness", children: ["Freshness ", sortKey === "freshness" ? "▼" : ""] }) }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: (0, jsx_runtime_1.jsx)("span", { className: "visually-hidden", children: "Action" }) })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: sortedRows.map((row) => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: row.retailerName }), (0, jsx_runtime_1.jsx)("td", { children: formatCents(row.priceCents) }), (0, jsx_runtime_1.jsx)("td", { children: row.perStickCents != null ? formatCents(row.perStickCents) : "—" }), (0, jsx_runtime_1.jsx)("td", { children: row.freshnessLabel ?? "—" }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("a", { href: row.ctaUrl, className: "cigar-deal-table__cta", rel: "noopener noreferrer", target: "_blank", children: row.ctaLabel ?? "Shop" }) })] }, row.retailerId))) })] })] }));
}
//# sourceMappingURL=DealComparisonTable.js.map