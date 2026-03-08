"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkSchema = void 0;
const zod_1 = require("zod");
/** Affiliate or direct link for a cigar at a retailer. We refer; disclosure required. */
exports.LinkSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    cigarId: zod_1.z.string().uuid(),
    retailerId: zod_1.z.string().uuid(),
    /** Affiliate URL (or direct if no program). */
    url: zod_1.z.string().url().max(2048),
    /** True if affiliate (FTC disclosure). */
    isAffiliate: zod_1.z.boolean().default(true),
    source: zod_1.z.string().max(64).optional(),
    createdAt: zod_1.z.coerce.date().optional(),
    updatedAt: zod_1.z.coerce.date().optional(),
});
//# sourceMappingURL=link.js.map