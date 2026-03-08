/**
 * In-memory price history store for development and testing.
 * Replace with a persistent implementation (DB, Redis) for production graphs.
 */
import type { PriceHistoryEntry, PriceHistoryStore } from "./priceHistory.js";
export declare class InMemoryPriceHistoryStore implements PriceHistoryStore {
    private entries;
    append(entry: PriceHistoryEntry): Promise<void>;
    getHistory(cigarId: string, retailerId: string, options?: {
        limit?: number;
    }): Promise<PriceHistoryEntry[]>;
}
//# sourceMappingURL=priceHistoryStore.d.ts.map