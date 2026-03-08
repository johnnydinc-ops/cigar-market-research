"use strict";
/**
 * In-memory price history store for development and testing.
 * Replace with a persistent implementation (DB, Redis) for production graphs.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPriceHistoryStore = void 0;
class InMemoryPriceHistoryStore {
    entries = [];
    async append(entry) {
        this.entries.push(entry);
    }
    async getHistory(cigarId, retailerId, options) {
        const limit = options?.limit ?? 100;
        const out = this.entries
            .filter((e) => e.cigarId === cigarId && e.retailerId === retailerId)
            .sort((a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime())
            .slice(0, limit);
        return out;
    }
}
exports.InMemoryPriceHistoryStore = InMemoryPriceHistoryStore;
//# sourceMappingURL=priceHistoryStore.js.map