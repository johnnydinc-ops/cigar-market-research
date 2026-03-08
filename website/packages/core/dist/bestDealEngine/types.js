"use strict";
/**
 * Best-deal engine: normalize by pack size, freshness, rank by price → freshness → trust.
 * Trust differentiator: unbiased ranking; no pay-to-rank.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACK_STICK_COUNT = void 0;
/** Stick count per pack for per-stick normalization (convention; box/bundle may vary). */
exports.PACK_STICK_COUNT = {
    single: 1,
    "5-pack": 5,
    "10-pack": 10,
    box: 20,
    bundle: 10,
    other: 1,
};
//# sourceMappingURL=types.js.map