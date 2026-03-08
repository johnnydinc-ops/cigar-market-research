"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustBlock = TrustBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
function TrustBlock({ retailerCount, disclaimer, methodologyHref, lastUpdatedLabel, }) {
    return ((0, jsx_runtime_1.jsxs)("aside", { className: "cigar-trust-block", "aria-label": "Trust and transparency", children: [(0, jsx_runtime_1.jsx)("p", { children: disclaimer }), retailerCount != null && ((0, jsx_runtime_1.jsxs)("p", { children: ["We compare prices from ", retailerCount, " US retailers."] })), lastUpdatedLabel != null && (0, jsx_runtime_1.jsx)("p", { children: lastUpdatedLabel }), methodologyHref != null && ((0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("a", { href: methodologyHref, children: "How we recommend" }) }))] }));
}
//# sourceMappingURL=TrustBlock.js.map