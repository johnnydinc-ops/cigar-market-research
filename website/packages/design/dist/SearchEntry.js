"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEntry = SearchEntry;
const jsx_runtime_1 = require("react/jsx-runtime");
function SearchEntry({ placeholder, onSubmit, disabled = false, ariaLabel = "Search for a cigar you like", }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.querySelector('input[name="cigar-search"]');
        const value = input?.value?.trim();
        if (value)
            onSubmit(value);
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "cigar-search-entry", onSubmit: handleSubmit, role: "search", "aria-label": ariaLabel, children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "cigar-search-input", className: "visually-hidden", children: ariaLabel }), (0, jsx_runtime_1.jsx)("input", { id: "cigar-search-input", name: "cigar-search", type: "search", className: "cigar-search-entry__input", placeholder: placeholder, disabled: disabled, "aria-label": ariaLabel, autoComplete: "off" }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "cigar-search-entry__btn", disabled: disabled, "aria-label": "Submit search", children: "Find similar" })] }));
}
//# sourceMappingURL=SearchEntry.js.map