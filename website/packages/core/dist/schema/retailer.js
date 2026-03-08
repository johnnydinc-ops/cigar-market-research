"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetailerSchema = void 0;
const zod_1 = require("zod");
/** US-only retailer. We refer; we don't sell. */
exports.RetailerSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(128),
    domain: zod_1.z.string().url().max(256).optional(),
    /** Affiliate program identifier (e.g. CJ, direct). */
    affiliateProgram: zod_1.z.string().max(64).optional(),
    /** States where affiliate is allowed (e.g. CI restrictions). Empty = all. */
    allowedStates: zod_1.z.array(zod_1.z.string().length(2)).default([]),
    /** Trust score 0–1 for ranking (later). */
    trustScore: zod_1.z.number().min(0).max(1).optional(),
    source: zod_1.z.string().max(64).optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=retailer.js.map